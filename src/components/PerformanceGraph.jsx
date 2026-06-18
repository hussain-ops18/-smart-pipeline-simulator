import React, { useState } from 'react';

function PerformanceGraph({ instructions }) {
  const [activeCard, setActiveCard] = useState(null);
  const n = instructions.length;
  const stages = 5;

  const withoutPipeline = n * stages;
  const withPipeline = stages + (n - 1);
  const speedup = (withoutPipeline / withPipeline).toFixed(2);
  const efficiency = ((speedup / stages) * 100).toFixed(1);
  const timeSaved = withoutPipeline - withPipeline;

  const concepts = [
    {
      id: 'without',
      icon: '🐢',
      title: 'Without Pipeline',
      value: `${withoutPipeline} cycles`,
      color: '#ef4444',
      explanation: `Without pipelining, each instruction must complete ALL ${stages} stages before the next one starts.`,
      formula: `${n} instructions × ${stages} stages = ${withoutPipeline} cycles`,
      simple: 'Like a single cashier — one customer fully done before next one starts!',
    },
    {
      id: 'with',
      icon: '🚀',
      title: 'With Pipeline',
      value: `${withPipeline} cycles`,
      color: '#10b981',
      explanation: `With pipelining, multiple instructions execute simultaneously in different stages.`,
      formula: `${stages} stages + (${n} - 1) extra instructions = ${withPipeline} cycles`,
      simple: 'Like an assembly line — multiple cars being built at same time!',
    },
    {
      id: 'speedup',
      icon: '⚡',
      title: 'Speedup Factor',
      value: `${speedup}x faster`,
      color: '#3b82f6',
      explanation: `Pipeline is ${speedup}x faster than non-pipelined execution.`,
      formula: `${withoutPipeline} ÷ ${withPipeline} = ${speedup}x`,
      simple: `For every 1 second non-pipeline takes, pipeline takes only ${(1/speedup).toFixed(2)} seconds!`,
    },
    {
      id: 'efficiency',
      icon: '📊',
      title: 'Efficiency',
      value: `${efficiency}%`,
      color: '#f59e0b',
      explanation: `Pipeline hardware is being used ${efficiency}% efficiently.`,
      formula: `(${speedup} ÷ ${stages} stages) × 100 = ${efficiency}%`,
      simple: efficiency > 70
        ? '✅ Great efficiency! Pipeline is well utilized.'
        : '⚠️ Lower efficiency due to hazards or fewer instructions.',
    },
    {
      id: 'saved',
      icon: '💾',
      title: 'Cycles Saved',
      value: `${timeSaved} cycles`,
      color: '#a78bfa',
      explanation: `Pipeline saves ${timeSaved} cycles compared to non-pipelined execution.`,
      formula: `${withoutPipeline} - ${withPipeline} = ${timeSaved} cycles saved`,
      simple: `That's ${Math.round((timeSaved / withoutPipeline) * 100)}% time reduction — huge improvement!`,
    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>

      {/* Header */}
      <h2 style={{
        background: 'linear-gradient(90deg, #10b981, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        📈 Performance Analysis
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px' }}>
        Click any card to understand what each metric means!
      </p>

      {/* Metric Cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {concepts.map(c => (
          <div
            key={c.id}
            onClick={() => setActiveCard(activeCard === c.id ? null : c.id)}
            style={{
              flex: '1',
              minWidth: '140px',
              background: activeCard === c.id
                ? `linear-gradient(135deg, ${c.color}25, rgba(15,12,41,0.95))`
                : 'rgba(15,12,41,0.8)',
              border: `1px solid ${activeCard === c.id ? c.color : c.color + '30'}`,
              borderRadius: '14px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: activeCard === c.id ? `0 0 15px ${c.color}30` : 'none',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.8rem', margin: '0 0 6px' }}>{c.icon}</p>
            <p style={{ color: c.color, fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 4px' }}>
              {c.value}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.72rem', margin: 0 }}>{c.title}</p>
            <p style={{ color: '#334155', fontSize: '0.65rem', marginTop: '6px' }}>
              {activeCard === c.id ? '▲ click to close' : '▼ click to learn'}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Explanation */}
      {activeCard && (() => {
        const c = concepts.find(x => x.id === activeCard);
        return (
          <div style={{
            background: `linear-gradient(135deg, ${c.color}12, rgba(15,12,41,0.95))`,
            border: `1px solid ${c.color}40`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            animation: 'fadeSlide 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '2rem' }}>{c.icon}</span>
              <div>
                <p style={{ color: c.color, fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
                  {c.title}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                  What does this mean?
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Explanation */}
              <div style={{
                flex: 1, minWidth: '200px',
                background: 'rgba(15,12,41,0.7)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid rgba(167,139,250,0.1)',
              }}>
                <p style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  📖 Explanation:
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
                  {c.explanation}
                </p>
              </div>

              {/* Formula */}
              <div style={{
                flex: 1, minWidth: '200px',
                background: 'rgba(15,12,41,0.7)',
                borderRadius: '10px',
                padding: '14px',
                border: `1px solid ${c.color}20`,
              }}>
                <p style={{ color: c.color, fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  🔢 Formula:
                </p>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  margin: 0,
                }}>
                  {c.formula}
                </p>
              </div>

              {/* Simple analogy */}
              <div style={{
                flex: 1, minWidth: '200px',
                background: 'rgba(15,12,41,0.7)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid rgba(167,139,250,0.1)',
              }}>
                <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  💡 Simple Analogy:
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
                  {c.simple}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Visual Comparison Bar */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '16px',
        padding: '22px',
        marginBottom: '20px',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '18px' }}>
          📊 Visual Comparison
        </p>

        {/* Without Pipeline */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🐢</span>
              <span style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 'bold' }}>Without Pipeline</span>
            </div>
            <span style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 'bold' }}>
              {withoutPipeline} cycles
            </span>
          </div>
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '8px', height: '32px', overflow: 'hidden' }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #ef4444, #dc2626)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '10px',
              transition: 'width 0.8s ease',
            }}>
              <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 'bold' }}>
                {n} inst × {stages} stages
              </span>
            </div>
          </div>
        </div>

        {/* With Pipeline */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🚀</span>
              <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 'bold' }}>With Pipeline</span>
            </div>
            <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 'bold' }}>
              {withPipeline} cycles
            </span>
          </div>
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '8px', height: '32px', overflow: 'hidden' }}>
            <div style={{
              width: `${(withPipeline / withoutPipeline) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #059669)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '10px',
              transition: 'width 0.8s ease',
              minWidth: '80px',
            }}>
              <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 'bold' }}>
                {stages} + ({n}-1)
              </span>
            </div>
          </div>
        </div>

        {/* Speedup Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>⚡</span>
              <span style={{ color: '#3b82f6', fontSize: '0.82rem', fontWeight: 'bold' }}>Speedup Factor</span>
            </div>
            <span style={{ color: '#3b82f6', fontSize: '0.82rem', fontWeight: 'bold' }}>{speedup}x</span>
          </div>
          <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '8px', height: '32px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min((speedup / stages) * 100, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '10px',
              transition: 'width 0.8s ease',
            }}>
              <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 'bold' }}>
                {withoutPipeline} ÷ {withPipeline}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stages Visual */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '16px',
        padding: '22px',
        marginBottom: '20px',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px' }}>
          🔄 How Pipeline Saves Time — Stage by Stage
        </p>
        <p style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '16px' }}>
          Each row = 1 instruction, Each column = 1 clock cycle
        </p>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '500px' }}>

            {/* Header */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
              <div style={{ width: '80px', flexShrink: 0 }} />
              {Array.from({ length: withPipeline }, (_, i) => (
                <div key={i} style={{
                  width: '40px', flexShrink: 0,
                  textAlign: 'center',
                  color: '#334155',
                  fontSize: '0.65rem',
                }}>
                  C{i + 1}
                </div>
              ))}
            </div>

            {/* Instructions */}
            {instructions.slice(0, Math.min(n, 6)).map((instr, i) => (
              <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{
                  width: '80px', flexShrink: 0,
                  color: '#64748b',
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  I{i + 1}
                </div>
                {Array.from({ length: withPipeline }, (_, c) => {
                  const si = c - i;
                  const stageNames = ['IF', 'ID', 'EX', 'MEM', 'WB'];
                  const stageColors2 = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
                  const isStage = si >= 0 && si < stages;
                  return (
                    <div key={c} style={{
                      width: '40px', height: '22px', flexShrink: 0,
                      borderRadius: '4px',
                      background: isStage ? stageColors2[si] + 'cc' : 'rgba(30,41,59,0.3)',
                      border: isStage ? `1px solid ${stageColors2[si]}` : '1px solid rgba(30,41,59,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isStage && (
                        <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 'bold' }}>
                          {stageNames[si]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {n > 6 && (
              <p style={{ color: '#334155', fontSize: '0.72rem', marginTop: '4px' }}>
                + {n - 6} more instructions...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Key Takeaway */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.12))',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: '14px',
        padding: '18px 20px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '2rem', flexShrink: 0 }}>🎯</span>
        <div>
          <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px' }}>
            Key Takeaway
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.7', margin: 0 }}>
            With <strong style={{ color: '#e2e8f0' }}>{n} instructions</strong>, pipelining reduces execution from{' '}
            <strong style={{ color: '#ef4444' }}>{withoutPipeline} cycles</strong> to{' '}
            <strong style={{ color: '#10b981' }}>{withPipeline} cycles</strong> —
            that's <strong style={{ color: '#3b82f6' }}>{speedup}x speedup</strong> and{' '}
            <strong style={{ color: '#a78bfa' }}>{timeSaved} cycles saved</strong>!
            This is why modern CPUs use pipelining — it dramatically improves performance
            without needing faster hardware! ⚡
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PerformanceGraph;