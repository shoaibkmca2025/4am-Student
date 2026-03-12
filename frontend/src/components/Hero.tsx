import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const codeLines = [
    'const buildTheFuture = async () => {',
    "  const vision = 'Limitless';",
    "  const quality = 'Compromise-free';",
    '',
    '  // Initialize growth protocol',
    '  await innovation.apply({ vision, quality });',
    '  return deploy({ scale: Infinity });',
    '};',
  ];

  useEffect(() => {
    if (lineIndex >= codeLines.length) return;

    const currentLine = codeLines[lineIndex];

    if (charIndex <= currentLine.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => {
          const lines = prev.split('\n');
          lines[lineIndex] = currentLine.substring(0, charIndex);
          return lines.join('\n');
        });
        setCharIndex((c) => c + 1);
      }, 40 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + '\n');
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [lineIndex, charIndex]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderCodeLine = (line: string, idx: number) => {
    if (!line) return <br key={idx} />;

    // Syntax highlighting
    const highlighted = line
      .replace(/(const|async|await|return)/g, '<span class="code-keyword">$1</span>')
      .replace(/('.*?')/g, '<span class="code-string">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>')
      .replace(/(=&gt;|=>)/g, '<span class="code-keyword">⇒</span>');

    return (
      <div key={idx} dangerouslySetInnerHTML={{ __html: highlighted }} />
    );
  };

  const displayLines = typedText.split('\n');

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.3), transparent 70%)' }} />
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="badge-pill mb-8 animate-fade-in-up">
              <span className="pulse-dot"></span>
              Engineering the Future of SaaS
            </div>

            <h1 className="section-title mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              Empowering Ideas
              <br />
              <span className="text-gradient">Beyond Midnight.</span>
            </h1>

            <p className="section-subtitle mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              We are a team of passionate engineers and designers dedicated to building
              high-performance software solutions and training the next generation of
              tech leaders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
              <button
                onClick={() => scrollTo('contact')}
                className="btn-primary group"
              >
                Build with us
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => scrollTo('training')}
                className="btn-ghost group"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Join Training
              </button>
            </div>
          </div>

          {/* Code editor */}
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="code-editor">
              <div className="code-editor-bar">
                <div className="code-dot" style={{ background: '#ff5f57' }} />
                <div className="code-dot" style={{ background: '#febc2e' }} />
                <div className="code-dot" style={{ background: '#28c840' }} />
                <span className="text-gray-500 text-xs ml-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  index.tsx
                </span>
              </div>
              <div className="code-editor-body" style={{ minHeight: '220px' }}>
                {displayLines.map((line, idx) => renderCodeLine(line, idx))}
                {lineIndex < codeLines.length && <span className="typing-cursor" />}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-black/5 dark:border-white/5 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {[
            { value: '1,280+', label: 'Active Deployments' },
            { value: '5+', label: 'Years of Innovation' },
            { value: '99%', label: 'Client Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <span className="text-xs text-gray-500 mb-2">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full animate-float" style={{ background: '#00f5ff' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
