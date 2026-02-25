import React, { useState } from 'react';
import { Mic, Play, Square, Video, Settings, MessageSquare, AlertCircle } from 'lucide-react';

const MockInterview: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  const toggleRecording = () => setIsRecording(!isRecording);
  const startSession = () => setSessionActive(true);
  const endSession = () => {
    setSessionActive(false);
    setIsRecording(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">AI Mock Interview</h2>
          <p className="text-slate-400">Practice with our AI interviewer to boost your confidence</p>
        </div>
        {!sessionActive && (
          <button 
            onClick={startSession}
            className="saas-button-primary flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start New Session
          </button>
        )}
        {sessionActive && (
          <button 
            onClick={endSession}
            className="px-6 py-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Square className="w-4 h-4" />
            End Session
          </button>
        )}
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        {/* Main Video Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 saas-card relative overflow-hidden flex items-center justify-center group">
            {sessionActive ? (
              <div className="relative w-full h-full">
                {/* AI Avatar Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center relative z-10 border-4 border-slate-700">
                    <Video className="w-12 h-12 text-slate-500" />
                  </div>
                </div>
                
                {/* User Camera Preview (Small) */}
                <div className="absolute bottom-6 right-6 w-48 h-36 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-slate-500 font-medium">Camera Preview</span>
                  </div>
                </div>

                {/* Status Overlay */}
                <div className="absolute top-6 left-6 px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm rounded-md border border-slate-700 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-error animate-pulse' : 'bg-success'}`}></div>
                  <span className="text-xs font-medium text-slate-200">{isRecording ? 'Recording...' : 'Live'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-6 text-slate-500 border border-slate-700">
                  <Video className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Ready to Start?</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                  Check your camera and microphone settings before beginning the interview session.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="saas-button-secondary flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Audio Settings
                  </button>
                  <button className="saas-button-secondary flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="h-20 saas-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleRecording}
                disabled={!sessionActive}
                className={`p-3 rounded-full transition-all ${
                  isRecording 
                    ? 'bg-error text-white' 
                    : 'bg-slate-700 text-slate-400 hover:text-slate-100 hover:bg-slate-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-mono text-sm">00:00:00</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Questions & Feedback */}
        <div className="saas-card flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Interview Progress
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {sessionActive ? (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Current Question</span>
                  <p className="text-slate-200 font-medium text-lg leading-relaxed">
                    "Tell me about a challenging project you worked on and how you overcame the obstacles."
                  </p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm mb-1">AI Tip</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Try using the STAR method (Situation, Task, Action, Result) to structure your answer clearly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-700">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Questions</span>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-sm opacity-60">
                    What are your greatest strengths and weaknesses?
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-sm opacity-40">
                    Where do you see yourself in 5 years?
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                <MessageSquare className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400 text-sm">Start a session to see questions and receive real-time feedback.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
