
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, Settings, 
  MessageSquare, Play, Square, AlertCircle, Loader2, 
  Volume2, Monitor, ChevronRight, RefreshCw 
} from 'lucide-react';
import { interviewService, Question, SessionState } from '../../services/interviewService';

const MockInterview: React.FC = () => {
  // Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionData, setSessionData] = useState<SessionState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Media State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Timer State
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Transcript Simulation
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize Media Stream
  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setPermissionError(null);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setPermissionError("Camera or microphone access denied. Please check your browser settings.");
      }
    };

    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Stream Updates
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, sessionActive]);

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
    setIsConnecting(true);
    try {
      const session = await interviewService.startSession(); // Simulated Backend Call
      setSessionData(session);
      setSessionActive(true);
      if (session.questions.length > 0) {
        setCurrentQuestion(session.questions[0]);
      }
      // Simulate Welcome Message
      setTranscript(["AI Interviewer: Hello! Let's begin. " + session.questions[0].text]);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      await interviewService.endSession();
      setSessionActive(false);
      setSessionData(null);
      setCurrentQuestion(null);
      setTranscript([]);
    }
  };

  const handleNextQuestion = async () => {
    if (!sessionData) return;
    setIsConnecting(true);
    // Simulate processing answer
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add dummy answer to transcript
    setTranscript(prev => [...prev, "You: [Answer recorded...]"]);
    
    const nextQ = await interviewService.getNextQuestion(); // Simulated Backend Call
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setTranscript(prev => [...prev, `AI Interviewer: ${nextQ.text}`]);
    } else {
      alert("Interview Completed!");
      handleEndSession();
    }
    setIsConnecting(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">AI Mock Interview</h2>
          <p className="text-slate-400 text-sm">Practice with our AI interviewer to boost your confidence</p>
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

      <div className="flex-1 grid lg:grid-cols-4 gap-4 min-h-0">
        {/* Left Column: Video & Controls */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Video Container */}
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden shadow-2xl group">
            
            {/* Permission Error Overlay */}
            {permissionError && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm p-6 text-center">
                <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-100 mb-2">Camera Access Required</h3>
                <p className="text-slate-400 max-w-md">{permissionError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
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
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 shadow-xl">
                    <VideoOff className="w-12 h-12 text-slate-500" />
                  </div>
                </div>
              )}

              {/* Status Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="px-3 py-1.5 bg-slate-950/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2 shadow-lg">
                  <div className={`w-2.5 h-2.5 rounded-full ${sessionActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className="text-xs font-bold text-slate-200 tracking-wide">
                    {sessionActive ? 'REC' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Central Overlay for Idle State */}
              {!sessionActive && !permissionError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                   <div className="w-24 h-24 bg-slate-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl ring-1 ring-white/5">
                    <VideoIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Ready to Start?</h3>
                  <p className="text-slate-300 max-w-md text-center mb-8 drop-shadow-sm font-medium">
                    Check your camera and microphone settings before beginning the interview session.
                  </p>
                  <div className="flex gap-4">
                    <button className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 rounded-xl border border-white/10 font-medium flex items-center gap-2 transition-all hover:scale-105">
                      <Settings className="w-4 h-4" />
                      Audio Settings
                    </button>
                    <button className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 rounded-xl border border-white/10 font-medium flex items-center gap-2 transition-all hover:scale-105">
                      <Monitor className="w-4 h-4" />
                      Video Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Bar */}
          <div className="h-16 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between px-6 shadow-xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMic}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isMicMuted 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleVideo}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isVideoOff 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Session Duration</span>
                <span className="text-xl font-mono font-bold text-slate-200 tracking-widest tabular-nums">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${sessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Chat */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-xl h-full">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Interview Progress
            </h3>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {sessionActive && currentQuestion ? (
              <>
                {/* Live Transcript / Chat History */}
                <div className="space-y-4 mb-8">
                  {transcript.map((msg, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.startsWith("AI") 
                        ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-tl-none' 
                        : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tr-none ml-8'
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
                <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">
                    Current Question
                  </span>
                  <p className="text-slate-100 font-medium text-lg leading-relaxed mb-4">
                    {currentQuestion.text}
                  </p>
                  
                  <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                     <button 
                       onClick={handleNextQuestion}
                       disabled={isConnecting}
                       className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                     >
                       {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                       Submit Answer
                     </button>
                     <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors">
                       <RefreshCw className="w-4 h-4" />
                     </button>
                  </div>
                </div>

                {/* AI Tip */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm mb-1">Real-time Feedback</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Speak clearly and maintain eye contact with the camera. The AI is analyzing your confidence levels.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 rotate-3">
                  <MessageSquare className="w-8 h-8 text-slate-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">Waiting to Start</h4>
                <p className="text-slate-500 text-sm max-w-[200px]">
                  Start a session to see interview questions and receive real-time AI feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
