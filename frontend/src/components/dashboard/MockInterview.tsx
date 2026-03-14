
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, Settings, 
  MessageSquare, Play, Square, AlertCircle, Loader2,
  Monitor, X, ChevronRight
} from 'lucide-react';
import { interviewServiceWrapper as interviewService, Question, SessionState } from '../../services/interviewService';
import { InterviewHistoryItem } from '../../services/api';

const MockInterview: React.FC = () => {
  // Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionData, setSessionData] = useState<SessionState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Media State
  const videoRef = useRef<HTMLVideoElement>(null);
  const settingsVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const meterRafRef = useRef<number | null>(null);
  const hasDetectedAudioRef = useRef(false);
  const isRecordingRef = useRef(false);
  const recordingStartedAtRef = useRef<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  // Timer State
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Transcript Simulation
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [latestFeedback, setLatestFeedback] = useState<{ score: number; feedback: string; improvements: string[]; criteria?: { clarity: number; relevance: number; completeness: number } } | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistoryItem[]>([]);

  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [showSettings, setShowSettings] = useState<'audio' | 'video' | null>(null);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const loadHistory = async () => {
    try {
      const rows = await interviewService.getHistory();
      setInterviewHistory(rows);
    } catch (error) {
      console.error('Failed to fetch interview history', error);
    }
  };

  // Initialize Media Stream (Removed auto-start)
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, []);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
        setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };
    getDevices();
    loadHistory();
  }, []);

  useEffect(() => {
    const handleOffline = () => setNetworkError('Internet connection lost. Please reconnect.');
    const handleOnline = () => setNetworkError(null);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const stopMedia = () => {
    if (meterRafRef.current) {
      cancelAnimationFrame(meterRafRef.current);
      meterRafRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicLevel(0);

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startAudioMeter = (mediaStream: MediaStream) => {
    try {
      if (meterRafRef.current) {
        cancelAnimationFrame(meterRafRef.current);
        meterRafRef.current = null;
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(mediaStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.85;

      source.connect(analyser);
      audioContextRef.current = ctx;
      sourceNodeRef.current = source;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.fftSize);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }

        const rms = Math.sqrt(sumSquares / dataArray.length);
        const level = Math.min(100, Math.round(rms * 220));
        setMicLevel(level);

        if (isRecordingRef.current && level >= 8) {
          hasDetectedAudioRef.current = true;
        }

        meterRafRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      console.error('Failed to initialize audio meter', error);
    }
  };

  const startMedia = async (audioId?: string, videoId?: string) => {
    stopMedia(); // Ensure previous stream is stopped
    try {
      const constraints: MediaStreamConstraints = {
        video: videoId ? { deviceId: { exact: videoId } } : true,
        audio: audioId ? { deviceId: { exact: audioId } } : true
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      startAudioMeter(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPermissionError(null);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setPermissionError("Camera or microphone access denied. Please check your browser settings.");
    }
  };

  // Handle Stream Updates
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    if (settingsVideoRef.current && stream && showSettings) {
      settingsVideoRef.current.srcObject = stream;
    }
  }, [stream, sessionActive, showSettings]);

  // Timer Logic
  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive]);

  // Format Timer
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Media
  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  // Session Management
  const handleStartSession = async () => {
    if (!navigator.onLine) {
      setNetworkError('Internet connection lost. Please reconnect.');
      return;
    }

    setValidationError(null);
    setLatestFeedback(null);
    setIsConnecting(true);
    await startMedia(selectedAudioId, selectedVideoId); // Start camera when session starts
    try {
      const session = await interviewService.startSession();
      setSessionData(session);
      setSessionActive(true);
      if (session.questions.length > 0) {
        setCurrentQuestion(session.questions[0]);
      }
      // Add initial greeting to transcript
      setTranscript(["AI Interviewer: Hello! Let's begin. " + (session.questions[0]?.text || '')]);
    } catch (error) {
      console.error("Failed to start session:", error);
      setNetworkError('Unable to start interview session. Please check your connection and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      try {
        await interviewService.endSession();
      } catch (error) {
        console.error("Failed to end session cleanly", error);
      }
      setSessionActive(false);
      setSessionData(null);
      setCurrentQuestion(null);
      setTranscript([]);
      setAnswerText('');
      setValidationError(null);
      setLatestFeedback(null);
      stopMedia(); // Stop camera when session ends
      await loadHistory();
    }
  };

  // Recording Logic
  const startRecording = () => {
    if (!stream) {
      setValidationError('Microphone is not available. Please allow microphone access.');
      return;
    }

    if (isMicMuted || stream.getAudioTracks().every((track) => !track.enabled)) {
      setValidationError('Microphone is muted. Please unmute before recording.');
      return;
    }
    setValidationError(null);
    hasDetectedAudioRef.current = false;
    recordingStartedAtRef.current = Date.now();
    
    audioChunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    recorder.start();
    setIsRecording(true);
    setIsSpeaking(true);
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(new Blob([], { type: 'audio/webm' }));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const durationMs = Date.now() - recordingStartedAtRef.current;
        if (durationMs >= 1200 && !hasDetectedAudioRef.current) {
          setValidationError('No audio is detected. Please check your microphone and try again.');
        }
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsSpeaking(false);
    });
  };

  const handleSubmitAnswer = async () => {
    if (!sessionData) return;

    if (!navigator.onLine) {
      setNetworkError('Internet connection lost. Please reconnect.');
      return;
    }

    const trimmedAnswer = answerText.trim();
    if (!trimmedAnswer) {
      setValidationError('Answer cannot be empty.');
      return;
    }

    setValidationError(null);

    // If currently recording, stop first
    if (isRecording) {
      await stopRecording();
    }

    setIsConnecting(true);
    
    try {
      const feedback = await interviewService.submitAnswer(trimmedAnswer);
      setLatestFeedback(feedback);
      
      // Add to transcript
      setTranscript(prev => [...prev, `You: ${trimmedAnswer}`]);
      setAnswerText('');
      
      // 2. Get Next Question
      const nextQ = await interviewService.getNextQuestion(); 
      if (nextQ) {
        setCurrentQuestion(nextQ);
        setTranscript(prev => [...prev, `AI Interviewer: ${nextQ.text}`]);
      } else {
        alert("Interview Completed!");
        await handleEndSession();
      }
    } catch (error) {
      console.error("Failed to process answer/next question", error);
      const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Failed to submit answer. Please try again.';
      if (String(message).toLowerCase().includes('network') || String(message).toLowerCase().includes('connection')) {
        setNetworkError('Internet connection lost. Please reconnect.');
      } else {
        setValidationError(message);
      }
    } finally {
      setIsConnecting(false);
      // Reset chunks for next question
      audioChunksRef.current = [];
    }
  };


  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col p-3 sm:p-4 space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">AI Mock Interview</h2>
          <p className="text-slate-600 text-sm">Practice with our AI interviewer to boost your confidence</p>
        </div>
        {!sessionActive ? (
          <button 
            onClick={handleStartSession}
            disabled={isConnecting || !!permissionError}
            className="saas-button-primary flex items-center gap-2 px-5 py-2.5 text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Start New Session
          </button>
        ) : (
          <button 
            onClick={handleEndSession}
            className="px-5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-rose-500/10 text-sm"
          >
            <Square className="w-4 h-4 fill-current" />
            End Session
          </button>
        )}
      </div>

      {networkError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          {networkError}
        </div>
      )}
      {validationError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          {validationError}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-4 min-h-0">
        {/* Left Column: Video & Controls */}
        <div className="xl:col-span-3 flex flex-col gap-4 min-h-[360px]">
          {/* Video Container */}
          <div className="flex-1 bg-white rounded-2xl border border-sky-200 relative overflow-hidden shadow-2xl group">
            
            {/* Permission Error Overlay */}
            {permissionError && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-sky-50/90 backdrop-blur-sm p-6 text-center">
                <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Camera Access Required</h3>
                <p className="text-slate-600 max-w-md">{permissionError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 px-6 py-2 bg-sky-100 hover:bg-sky-200 text-slate-800 rounded-lg border border-sky-200 transition-colors"
                >
                  Retry Access
                </button>
              </div>
            )}

            {/* Main Video Feed */}
            <div className="relative w-full h-full bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
              />
              
              {/* Video Off Placeholder */}
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center border-4 border-sky-200 shadow-xl">
                    <VideoOff className="w-12 h-12 text-slate-500" />
                  </div>
                </div>
              )}

              {/* Status Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="px-3 py-1.5 bg-sky-50/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2 shadow-lg">
                  <div className={`w-2.5 h-2.5 rounded-full ${sessionActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className="text-xs font-bold text-slate-800 tracking-wide">
                    {sessionActive ? 'REC' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Central Overlay for Idle State */}
              {!sessionActive && !permissionError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-50/40 backdrop-blur-[2px]">
                   <div className="w-24 h-24 bg-sky-100/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl ring-1 ring-white/5">
                    <VideoIcon className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 drop-shadow-md">Ready to Start?</h3>
                  <p className="text-slate-700 max-w-md text-center mb-8 drop-shadow-sm font-medium">
                    Check your camera and microphone settings before beginning the interview session.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setShowSettings('audio');
                        startMedia(selectedAudioId, selectedVideoId);
                      }}
                      className="px-5 py-2.5 bg-sky-100/80 hover:bg-sky-200/80 backdrop-blur-md text-slate-800 rounded-xl border border-white/10 font-medium flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Settings className="w-4 h-4" />
                      Audio Settings
                    </button>
                    <button 
                      onClick={() => {
                        setShowSettings('video');
                        startMedia(selectedAudioId, selectedVideoId);
                      }}
                      className="px-5 py-2.5 bg-sky-100/80 hover:bg-sky-200/80 backdrop-blur-md text-slate-800 rounded-xl border border-white/10 font-medium flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      Video Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-white rounded-2xl border border-sky-200 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 shadow-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={toggleMic}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isMicMuted 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' 
                    : 'bg-sky-100 text-slate-600 border border-sky-200 hover:text-primary hover:bg-sky-200 hover:border-sky-300'
                }`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleVideo}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isVideoOff 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' 
                    : 'bg-sky-100 text-slate-600 border border-sky-200 hover:text-primary hover:bg-sky-200 hover:border-sky-300'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Session Duration</span>
                <span className="text-lg sm:text-xl font-mono font-bold text-slate-800 tracking-widest tabular-nums">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${sessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-sky-200'}`}></div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Chat */}
        <div className="bg-white rounded-2xl border border-sky-200 flex flex-col overflow-hidden shadow-xl h-full min-h-[360px]">
          {/* Header */}
          <div className="p-5 border-b border-sky-200 bg-white/50 backdrop-blur-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Interview Progress
            </h3>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {sessionActive && currentQuestion ? (
              <>
                {/* Live Transcript / Chat History */}
                <div className="space-y-4 mb-8">
                  {transcript.map((msg, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.startsWith("AI") 
                        ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-tl-none' 
                        : 'bg-sky-100 border border-sky-200 text-slate-700 rounded-tr-none ml-8'
                    }`}>
                      <span className="block text-xs font-bold opacity-50 mb-1 uppercase tracking-wider">
                        {msg.startsWith("AI") ? "AI Interviewer" : "You"}
                      </span>
                      {msg.replace(/^(AI Interviewer|You): /, '')}
                    </div>
                  ))}
                  {isConnecting && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm animate-pulse px-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI is thinking...
                    </div>
                  )}
                </div>

                {/* Current Question Card */}
                <div className="p-4 sm:p-5 bg-white border border-sky-200 rounded-2xl shadow-lg relative overflow-hidden">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">
                    Current Question
                  </span>
                  <p className="text-slate-900 font-medium text-base sm:text-lg leading-relaxed mb-4">
                    {currentQuestion.text}
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Your Answer</label>
                    <textarea
                      value={answerText}
                      onChange={(e) => {
                        setAnswerText(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full min-h-[110px] rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                      placeholder="Type your answer here before submitting..."
                    />
                    <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                        <span>Microphone Input</span>
                        <span>{isRecording ? 'Recording...' : 'Idle'}</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded bg-slate-100">
                        <div
                          className={`h-full transition-all duration-100 ${micLevel >= 8 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                          style={{ width: `${Math.max(4, micLevel)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-sky-100">
                     {!isRecording ? (
                       <button 
                         onClick={startRecording}
                         disabled={isConnecting}
                         className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                       >
                         <Mic className="w-4 h-4" />
                         Start Recording
                       </button>
                     ) : (
                       <button 
                         onClick={stopRecording}
                         disabled={isConnecting}
                         className="w-full bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 animate-pulse"
                       >
                         <Square className="w-4 h-4 fill-current" />
                         Stop Recording
                       </button>
                     )}
                     <button
                       onClick={handleSubmitAnswer}
                       disabled={isConnecting}
                       className="w-full sm:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                     >
                       {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                       Submit Answer
                     </button>
                  </div>
                </div>

                {latestFeedback && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">Latest AI Feedback</h4>
                      <span className="text-sm font-bold text-indigo-700">Score: {latestFeedback.score}/100</span>
                    </div>
                    <p className="text-sm text-slate-700">{latestFeedback.feedback}</p>
                    {latestFeedback.criteria && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="rounded-lg bg-white border border-indigo-100 px-3 py-2 font-medium text-slate-700">Clarity: {latestFeedback.criteria.clarity}</div>
                        <div className="rounded-lg bg-white border border-indigo-100 px-3 py-2 font-medium text-slate-700">Relevance: {latestFeedback.criteria.relevance}</div>
                        <div className="rounded-lg bg-white border border-indigo-100 px-3 py-2 font-medium text-slate-700">Completeness: {latestFeedback.criteria.completeness}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Tip */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Real-time Feedback</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Speak clearly and maintain eye contact with the camera. The AI is analyzing your confidence levels.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 opacity-70">
                  <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-4 border border-sky-200 rotate-3">
                    <MessageSquare className="w-8 h-8 text-slate-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">Waiting to Start</h4>
                  <p className="text-slate-500 text-sm max-w-[260px]">
                    Start a session to see interview questions and receive real-time AI feedback.
                  </p>
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-800">Interview History</h4>
                    <button
                      onClick={loadHistory}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-sky-200 bg-white text-slate-600 hover:bg-sky-100"
                    >
                      Refresh
                    </button>
                  </div>

                  {interviewHistory.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-500">No previous interview sessions yet.</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {interviewHistory.slice(0, 6).map((item) => (
                        <div key={item.id} className="rounded-lg border border-sky-200 bg-white px-3 py-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">{new Date(item.date).toLocaleDateString()}</span>
                            <span className="font-bold text-indigo-700">{item.score}/100</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{item.feedback}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Settings Modal */}
        {showSettings && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-900/30 backdrop-blur-sm p-4">
            <div className="bg-white border border-sky-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b border-sky-200 flex justify-between items-center bg-white/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {showSettings === 'audio' ? <Settings className="w-5 h-5 text-indigo-500" /> : <Monitor className="w-5 h-5 text-indigo-500" />}
                  {showSettings === 'audio' ? 'Audio Settings' : 'Video Settings'}
                </h3>
                <button 
                  onClick={() => {
                    setShowSettings(null);
                    if (!sessionActive) stopMedia();
                  }}
                  className="p-2 hover:bg-sky-100 rounded-lg text-slate-600 hover:text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Device Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    {showSettings === 'audio' ? 'Microphone' : 'Camera'}
                  </label>
                  <select 
                    className="w-full bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={showSettings === 'audio' ? selectedAudioId : selectedVideoId}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (showSettings === 'audio') {
                        setSelectedAudioId(value);
                        startMedia(value, selectedVideoId);
                      } else {
                        setSelectedVideoId(value);
                        startMedia(selectedAudioId, value);
                      }
                    }}
                  >
                    <option value="">Default {showSettings === 'audio' ? 'Microphone' : 'Camera'}</option>
                    {(showSettings === 'audio' ? audioDevices : videoDevices).map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `${showSettings === 'audio' ? 'Microphone' : 'Camera'} ${device.deviceId.slice(0, 5)}...`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-sky-200 relative">
                  <video 
                    ref={settingsVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff && showSettings === 'video' ? 'opacity-50' : ''}`}
                  />
                  {showSettings === 'audio' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                        <Mic className="w-8 h-8 text-indigo-500" />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 text-center">
                  {showSettings === 'audio' 
                    ? "Speak to test your microphone. The indicator above should pulse." 
                    : "Check your video framing and lighting."}
                </p>

                <button 
                  onClick={() => {
                    setShowSettings(null);
                    if (!sessionActive) stopMedia();
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;


