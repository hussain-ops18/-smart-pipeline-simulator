import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  '🔀 How does forwarding work?',
  '⏸️ What are stall cycles?',
  '🌿 Explain branch prediction',
  '📊 Compare pipeline vs non-pipeline',
  '🔧 How to fix structural hazard?',
  '⚡ What is a data hazard?',
];

function AIExplainer({ hazards, instructions }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef(null);

  const hazardSummary = hazards.length === 0
    ? 'No hazards detected. Pipeline runs smoothly.'
    : hazards.map((h, i) =>
        `Hazard ${i + 1}: ${h.type} between "${h.instruction1}" and "${h.instruction2}". Solution: ${h.solution}`
      ).join('\n');

  const systemContext = `You are an expert CPU Pipeline and Computer Organization tutor.
The student has entered these instructions:
${instructions.join('\n')}

Detected hazards:
${hazardSummary}

Always start by explaining the current pipeline state and detected hazards clearly.
Then answer any follow-up questions. Use emojis, examples, and clear formatting.
Keep responses educational, concise and helpful.`;

  const getInitialExplanation = async () => {
    setLoading(true);

    const prompt = `Please analyze these pipeline instructions and explain:
1. What each instruction does
2. What hazards were detected and why
3. How to resolve each hazard
4. Overall pipeline performance impact

Instructions: ${instructions.join(', ')}
Hazards: ${hazardSummary}`;

    try {
      const response = await fetch('http://localhost:5000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: systemContext + '\n\n' + prompt }],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response received.';

      setMessages([{
        role: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInitial: true,
      }]);
    } catch (err) {
      setMessages([{
        role: 'assistant',
        text: '❌ Error connecting to AI server. Make sure server is running on port 5000.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      }]);
    }

    setLoading(false);
    setInitialized(true);
  };

  useEffect(() => {
    if (instructions.length > 0) {
      setMessages([]);
      setInitialized(false);
      getInitialExplanation();
    }
  }, [instructions, hazards]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [
        { role: 'user', content: systemContext },
        ...updatedMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
      ];

      const response = await fetch('http://localhost:5000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response received.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '❌ Error connecting to AI. Check if server is running on port 5000.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      }]);
    }

    setLoading(false);
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#a78bfa">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(167,139,250,0.15);color:#a78bfa;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>

      {/* Header */}
      <h2 style={{
        background: 'linear-gradient(90deg, #6366f1, #a78bfa, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        🤖 Pipeline AI Assistant
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '16px' }}>
        AI automatically explains your pipeline — then ask anything!
      </p>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Instructions', value: instructions.length, color: '#3b82f6', icon: '📝' },
          { label: 'Hazards', value: hazards.length, color: '#ef4444', icon: '⚠️' },
          { label: 'AI Model', value: 'LLaMA 3.3', color: '#10b981', icon: '🧠' },
          { label: 'Status', value: loading ? 'Thinking...' : initialized ? 'Ready' : 'Loading...', color: '#f59e0b', icon: '⚡' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, minWidth: '110px',
            background: 'rgba(15,12,41,0.8)',
            border: `1px solid ${stat.color}30`,
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{stat.icon}</span>
            <div>
              <p style={{ color: stat.color, fontWeight: 'bold', fontSize: '0.85rem', margin: 0 }}>
                {stat.value}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.68rem', margin: 0 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}>

        {/* Chat Header */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(167,139,250,0.15))',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(167,139,250,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 0 12px rgba(99,102,241,0.5)',
            }}>
              🤖
            </div>
            <div>
              <p style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.88rem', margin: 0 }}>
                Pipeline AI Assistant
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: loading ? '#f59e0b' : '#10b981',
                  boxShadow: `0 0 5px ${loading ? '#f59e0b' : '#10b981'}`,
                  animation: loading ? 'pulse 1s infinite' : 'none',
                }} />
                <p style={{ color: loading ? '#f59e0b' : '#10b981', fontSize: '0.68rem', margin: 0 }}>
                  {loading ? 'Analyzing pipeline...' : 'Online — Powered by LLaMA 3.3'}
                </p>
              </div>
            </div>
          </div>

          {/* Clear chat */}
          <button
            onClick={() => {
              setMessages([]);
              setInitialized(false);
              getInitialExplanation();
            }}
            style={{
              padding: '5px 12px',
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '0.72rem',
              cursor: 'pointer',
            }}
          >
            ↺ Re-analyze
          </button>
        </div>

        {/* Messages Area */}
        <div style={{
          height: '420px',
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>

          {/* Initial loading */}
          {messages.length === 0 && loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px' }}>
              <div style={{
                width: '60px', height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem',
                boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                animation: 'pulse 1.5s infinite',
              }}>
                🤖
              </div>
              <p style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Analyzing your pipeline...
              </p>
              <p style={{ color: '#475569', fontSize: '0.8rem' }}>
                AI is examining {instructions.length} instructions and {hazards.length} hazards
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2].map(dot => (
                  <div key={dot} style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    animation: `bounce 1.2s ease-in-out ${dot * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '8px',
              animation: 'fadeSlide 0.3s ease',
            }}>

              {/* AI Avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  background: msg.isInitial
                    ? 'linear-gradient(135deg, #6366f1, #a78bfa)'
                    : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  boxShadow: msg.isInitial ? '0 0 10px rgba(99,102,241,0.4)' : 'none',
                }}>
                  🤖
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: '78%',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                  : msg.error
                    ? 'rgba(239,68,68,0.12)'
                    : msg.isInitial
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(30,41,59,0.95))'
                      : 'rgba(30,41,59,0.9)',
                border: msg.role === 'user'
                  ? 'none'
                  : msg.error
                    ? '1px solid rgba(239,68,68,0.3)'
                    : msg.isInitial
                      ? '1px solid rgba(99,102,241,0.3)'
                      : '1px solid rgba(167,139,250,0.12)',
                borderRadius: msg.role === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                padding: '12px 16px',
              }}>
                {msg.isInitial && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '8px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(99,102,241,0.2)',
                  }}>
                    <span style={{ fontSize: '0.8rem' }}>🔍</span>
                    <span style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      AUTO ANALYSIS — {instructions.length} Instructions, {hazards.length} Hazards
                    </span>
                  </div>
                )}
                <p
                  style={{
                    color: '#e2e8f0',
                    fontSize: '0.83rem',
                    lineHeight: '1.65',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
                <p style={{
                  color: msg.role === 'user' ? 'rgba(255,255,255,0.45)' : '#334155',
                  fontSize: '0.62rem',
                  marginTop: '6px',
                  marginBottom: 0,
                  textAlign: 'right',
                }}>
                  {msg.time}
                </p>
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div style={{
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Loading dots */}
          {loading && messages.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', animation: 'fadeSlide 0.3s ease' }}>
              <div style={{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem',
              }}>
                🤖
              </div>
              <div style={{
                background: 'rgba(30,41,59,0.9)',
                border: '1px solid rgba(167,139,250,0.12)',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                display: 'flex', gap: '5px', alignItems: 'center',
              }}>
                {[0, 1, 2].map(dot => (
                  <div key={dot} style={{
                    width: '7px', height: '7px',
                    borderRadius: '50%',
                    background: '#a78bfa',
                    animation: `bounce 1.2s ease-in-out ${dot * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            disabled={loading}
            style={{
              padding: '6px 13px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '20px',
              color: '#818cf8',
              fontSize: '0.73rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseOver={e => { if (!loading) e.target.style.background = 'rgba(99,102,241,0.2)'; }}
            onMouseOut={e => { e.target.style.background = 'rgba(99,102,241,0.08)'; }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '10px',
        background: 'rgba(15,12,41,0.9)',
        border: '1px solid rgba(167,139,250,0.25)',
        borderRadius: '14px',
        padding: '10px 14px',
        alignItems: 'flex-end',
      }}>
        <textarea
          rows={1}
          placeholder="Ask anything about your pipeline..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
            resize: 'none',
            lineHeight: '1.5',
            maxHeight: '100px',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            width: '38px', height: '38px',
            borderRadius: '10px',
            background: loading || !input.trim()
              ? 'rgba(99,102,241,0.15)'
              : 'linear-gradient(135deg, #6366f1, #a78bfa)',
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: !loading && input.trim() ? '0 0 10px rgba(99,102,241,0.4)' : 'none',
          }}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
      <p style={{ color: '#1e293b', fontSize: '0.68rem', marginTop: '6px', textAlign: 'center' }}>
        Enter to send • Shift+Enter for new line
      </p>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default AIExplainer;