import React, { useState, useEffect } from 'react';

const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'];

const stageColors = {
  IF:  { bg: '#3b82f6', glow: '#3b82f680' },
  ID:  { bg: '#8b5cf6', glow: '#8b5cf680' },
  EX:  { bg: '#f59e0b', glow: '#f59e0b80' },
  MEM: { bg: '#10b981', glow: '#10b98180' },
  WB:  { bg: '#ef4444', glow: '#ef444480' },
};

function parseInstruction(instr) {
  const parts = instr.replace(/,/g, '').split(/\s+/);
  return { op: parts[0], dest: parts[1], src1: parts[2], src2: parts[3] };
}

function detectHazardAt(instructions, i) {
  if (i === 0) return null;
  const curr = parseInstruction(instructions[i]);
  for (let j = Math.max(0, i - 2); j < i; j++) {
    const prev = parseInstruction(instructions[j]);
    if (prev.dest && (prev.dest === curr.src1 || prev.dest === curr.src2)) {
      return 'data';
    }
    if (['BEQ','BNE','JUMP','JMP'].includes(prev.op?.toUpperCase())) {
      return 'control';
    }
    if (['LOAD','STORE'].includes(prev.op?.toUpperCase()) &&
        ['LOAD','STORE'].includes(curr.op?.toUpperCase())) {
      return 'structural';
    }
  }
  return null;
}

const hazardColors = {
  data:       { border: '#ef4444', label: '⚡ Data Hazard',       bg: '#ef444420' },
  control:    { border: '#f59e0b', label: '🔀 Control Hazard',    bg: '#f59e0b20' },
  structural: { border: '#8b5cf6', label: '🔧 Structural Hazard', bg: '#8b5cf620' },
};

function PipelineVisualizer({ instructions }) {
  const [visibleCols, setVisibleCols] = useState(0);
  const cycles = instructions.length + STAGES.length - 1;

  useEffect(() => {
    setVisibleCols(0);
    let col = 0;
    const interval = setInterval(() => {
      col++;
      setVisibleCols(col);
      if (col >= cycles) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [instructions, cycles]);

  const getStage = (instrIndex, cycle) => {
    const si = cycle - instrIndex;
    if (si >= 0 && si < STAGES.length) return STAGES[si];
    return null;
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '10px' }}>

      {/* Header */}
      <h2 style={{
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ef4444)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        📊 Pipeline Execution Diagram
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px' }}>
        Watch instructions flow through pipeline stages cycle by cycle
      </p>

      {/* Stage Legend */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        {STAGES.map(s => (
          <div key={s} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15,12,41,0.7)',
            border: `1px solid ${stageColors[s].bg}50`,
            borderRadius: '8px',
            padding: '5px 12px',
          }}>
            <div style={{
              width: '10px', height: '10px',
              borderRadius: '3px',
              background: stageColors[s].bg,
              boxShadow: `0 0 6px ${stageColors[s].glow}`,
            }} />
            <span style={{ color: stageColors[s].bg, fontSize: '0.78rem', fontWeight: 'bold' }}>{s}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(15,12,41,0.7)',
          border: '1px solid rgba(100,116,139,0.3)',
          borderRadius: '8px', padding: '5px 12px',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '3px',
            background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 3px, #334155 3px, #334155 6px)',
          }} />
          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Bubble/Stall</span>
        </div>
      </div>

      {/* Pipeline Table */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: '16px',
        padding: '20px',
        overflowX: 'auto',
        marginBottom: '20px',
      }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '4px', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{
                color: '#64748b', padding: '8px 12px', textAlign: 'left',
                fontSize: '0.78rem', fontWeight: 'bold', letterSpacing: '1px',
                whiteSpace: 'nowrap', minWidth: '160px',
              }}>
                INSTRUCTION
              </th>
              {Array.from({ length: cycles }, (_, i) => (
                <th key={i} style={{
                  color: '#475569', padding: '8px 6px',
                  textAlign: 'center', fontSize: '0.72rem',
                  fontWeight: 'bold', minWidth: '48px',
                }}>
                  C{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {instructions.map((instr, i) => {
              const hazard = detectHazardAt(instructions, i);
              const hc = hazard ? hazardColors[hazard] : null;
              return (
                <tr key={i}>
                  {/* Instruction label */}
                  <td style={{ padding: '4px 8px' }}>
                    <div style={{
                      background: hc ? hc.bg : 'rgba(30,41,59,0.6)',
                      border: `1px solid ${hc ? hc.border : 'rgba(100,116,139,0.2)'}`,
                      borderRadius: '8px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{
                        background: `rgba(167,139,250,0.2)`,
                        color: '#a78bfa',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        fontSize: '0.68rem',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}>
                        I{i + 1}
                      </span>
                      <span style={{
                        color: hc ? hc.border : '#cbd5e1',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        whiteSpace: 'nowrap',
                      }}>
                        {instr}
                      </span>
                      {hc && (
                        <span style={{
                          color: hc.border,
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          marginLeft: 'auto',
                          whiteSpace: 'nowrap',
                        }}>
                          {hc.label}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stage cells */}
                  {Array.from({ length: cycles }, (_, c) => {
                    const stage = getStage(i, c);
                    const visible = c < visibleCols;
                    const sc = stage ? stageColors[stage] : null;
                    return (
                      <td key={c} style={{ padding: '4px 2px', textAlign: 'center' }}>
                        {visible && stage ? (
                          <div style={{
                            background: `linear-gradient(135deg, ${sc.bg}cc, ${sc.bg}88)`,
                            border: `1px solid ${sc.bg}`,
                            borderRadius: '8px',
                            padding: '5px 2px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            color: 'white',
                            boxShadow: `0 0 8px ${sc.glow}`,
                            transition: 'all 0.3s ease',
                            animation: 'fadeSlide 0.3s ease',
                            minWidth: '40px',
                          }}>
                            {stage}
                          </div>
                        ) : visible ? (
                          // Bubble
                          <div style={{
                            background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 3px, #0f172a 3px, #0f172a 6px)',
                            border: '1px solid rgba(100,116,139,0.15)',
                            borderRadius: '8px',
                            padding: '5px 2px',
                            fontSize: '0.65rem',
                            color: '#334155',
                            minWidth: '40px',
                          }}>
                            —
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hazard Summary */}
      {instructions.some((_, i) => detectHazardAt(instructions, i)) && (
        <div style={{
          background: 'rgba(15,12,41,0.8)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '16px',
        }}>
          <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>
            ⚠️ Hazards Detected in Pipeline:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {instructions.map((instr, i) => {
              const hazard = detectHazardAt(instructions, i);
              if (!hazard) return null;
              const hc = hazardColors[hazard];
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: hc.bg,
                  border: `1px solid ${hc.border}40`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}>
                  <span style={{ color: hc.border, fontWeight: 'bold', fontSize: '0.82rem' }}>
                    {hc.label}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                    I{i + 1}: <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>{instr}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Instructions', value: instructions.length, color: '#3b82f6' },
          { label: 'Total Cycles', value: cycles, color: '#8b5cf6' },
          { label: 'Pipeline Stages', value: 5, color: '#f59e0b' },
          { label: 'Hazards Found', value: instructions.filter((_, i) => detectHazardAt(instructions, i)).length, color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, minWidth: '120px',
            background: 'rgba(15,12,41,0.8)',
            border: `1px solid ${stat.color}30`,
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <p style={{ color: stat.color, fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
              {stat.value}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '4px' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PipelineVisualizer;