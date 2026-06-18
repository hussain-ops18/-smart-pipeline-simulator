import React, { useEffect, useState } from 'react';

function parseInstruction(instr) {
  const parts = instr.replace(/,/g, '').split(/\s+/);
  return {
    op: parts[0]?.toUpperCase(),
    dest: parts[1],
    src1: parts[2],
    src2: parts[3],
  };
}

function detectHazards(instructions) {
  const hazards = [];
  for (let i = 1; i < instructions.length; i++) {
    const curr = parseInstruction(instructions[i]);
    for (let j = Math.max(0, i - 2); j < i; j++) {
      const prev = parseInstruction(instructions[j]);
      const distance = i - j;

      if (prev.dest && (prev.dest === curr.src1 || prev.dest === curr.src2)) {
        hazards.push({
          type: 'Data Hazard',
          subtype: 'RAW (Read After Write)',
          instruction1: instructions[j],
          instruction2: instructions[i],
          index1: j,
          index2: i,
          distance,
          conflictReg: prev.dest,
          solution: distance === 1
            ? 'Insert 2 stall cycles OR use data forwarding'
            : 'Insert 1 stall cycle OR use data forwarding',
          solutionSteps: [
            'Detect register dependency',
            distance === 1 ? 'Insert 2 NOPs / stall cycles' : 'Insert 1 NOP / stall cycle',
            'OR use forwarding path from EX/MEM stage',
          ],
          color: '#ef4444',
          bg: '#ef444415',
          icon: '⚡',
          severity: distance === 1 ? 'High' : 'Medium',
        });
      }

      if (['BEQ', 'BNE', 'JUMP', 'JMP', 'BLT', 'BGT'].includes(prev.op)) {
        hazards.push({
          type: 'Control Hazard',
          subtype: 'Branch Instruction',
          instruction1: instructions[j],
          instruction2: instructions[i],
          index1: j,
          index2: i,
          distance,
          conflictReg: null,
          solution: 'Use branch prediction OR flush pipeline',
          solutionSteps: [
            'Detect branch instruction in ID stage',
            'Predict branch outcome (taken/not taken)',
            'If wrong: flush incorrectly fetched instructions',
            'OR use delayed branching technique',
          ],
          color: '#f59e0b',
          bg: '#f59e0b15',
          icon: '🔀',
          severity: 'High',
        });
      }

      if (
        ['LOAD', 'STORE'].includes(prev.op) &&
        ['LOAD', 'STORE'].includes(curr.op)
      ) {
        hazards.push({
          type: 'Structural Hazard',
          subtype: 'Memory Unit Conflict',
          instruction1: instructions[j],
          instruction2: instructions[i],
          index1: j,
          index2: i,
          distance,
          conflictReg: null,
          solution: 'Stall pipeline — memory unit conflict',
          solutionSteps: [
            'Detect simultaneous memory access',
            'Stall one instruction for 1 cycle',
            'Allow first instruction to complete MEM stage',
            'Then allow second instruction to proceed',
          ],
          color: '#8b5cf6',
          bg: '#8b5cf615',
          icon: '🔧',
          severity: 'Medium',
        });
      }
    }
  }
  return hazards;
}

const severityColors = {
  High: { color: '#ef4444', bg: '#ef444420', label: '🔴 High' },
  Medium: { color: '#f59e0b', bg: '#f59e0b20', label: '🟡 Medium' },
  Low: { color: '#10b981', bg: '#10b98120', label: '🟢 Low' },
};

function HazardCard({ hazard, index, expanded, onToggle }) {
  const sc = severityColors[hazard.severity];

  return (
    <div style={{
      background: expanded
        ? `linear-gradient(135deg, ${hazard.bg}, rgba(10,8,30,0.95))`
        : 'rgba(15,12,41,0.8)',
      border: `1px solid ${expanded ? hazard.color : hazard.color + '40'}`,
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'all 0.3s',
      boxShadow: expanded ? `0 0 20px ${hazard.color}25` : 'none',
      animation: 'fadeSlide 0.4s ease',
    }}>

      {/* Card Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '14px 18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Hazard number */}
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: `${hazard.color}30`,
            border: `2px solid ${hazard.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: hazard.color,
            fontWeight: 'bold',
            fontSize: '0.82rem',
            flexShrink: 0,
          }}>
            {index + 1}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: hazard.color, fontWeight: 'bold', fontSize: '0.9rem' }}>
                {hazard.icon} {hazard.type}
              </span>
              <span style={{
                background: hazard.color + '25',
                color: hazard.color,
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '2px 7px',
                borderRadius: '10px',
                border: `1px solid ${hazard.color}40`,
              }}>
                {hazard.subtype}
              </span>
              <span style={{
                background: sc.bg,
                color: sc.color,
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '2px 7px',
                borderRadius: '10px',
              }}>
                {sc.label}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '3px 0 0' }}>
              Between I{hazard.index1 + 1} and I{hazard.index2 + 1} — Distance: {hazard.distance} cycle{hazard.distance > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <span style={{ color: '#475569', fontSize: '0.8rem', flexShrink: 0 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: '0 18px 18px', animation: 'fadeSlide 0.3s ease' }}>

          {/* Instructions involved */}
          <div style={{
            background: 'rgba(10,8,30,0.7)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '14px',
            border: `1px solid ${hazard.color}20`,
          }}>
            <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>
              INSTRUCTIONS INVOLVED:
            </p>

            {/* Instruction 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                background: '#3b82f620',
                border: '1px solid #3b82f640',
                borderRadius: '6px',
                padding: '2px 8px',
                color: '#3b82f6',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                I{hazard.index1 + 1}
              </div>
              <code style={{
                background: 'rgba(30,41,59,0.8)',
                color: '#e2e8f0',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                flex: 1,
              }}>
                {hazard.instruction1}
              </code>
              <span style={{
                background: '#10b98120',
                color: '#10b981',
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: '6px',
                flexShrink: 0,
              }}>
                writes {hazard.conflictReg || 'mem'}
              </span>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingLeft: '40px' }}>
              <div style={{
                height: '20px',
                width: '2px',
                background: `linear-gradient(${hazard.color}, ${hazard.color}40)`,
                marginLeft: '15px',
              }} />
              <span style={{
                color: hazard.color,
                fontSize: '0.68rem',
                fontWeight: 'bold',
              }}>
                ↕ {hazard.type} — {hazard.distance} cycle gap
              </span>
            </div>

            {/* Instruction 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#ef444420',
                border: '1px solid #ef444440',
                borderRadius: '6px',
                padding: '2px 8px',
                color: '#ef4444',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                I{hazard.index2 + 1}
              </div>
              <code style={{
                background: 'rgba(30,41,59,0.8)',
                color: '#e2e8f0',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                flex: 1,
              }}>
                {hazard.instruction2}
              </code>
              <span style={{
                background: '#ef444420',
                color: '#ef4444',
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: '6px',
                flexShrink: 0,
              }}>
                reads {hazard.conflictReg || 'mem'}
              </span>
            </div>
          </div>

          {/* Solution Steps */}
          <div style={{
            background: 'rgba(10,8,30,0.7)',
            borderRadius: '10px',
            padding: '14px',
            border: `1px solid ${hazard.color}20`,
          }}>
            <p style={{ color: hazard.color, fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px' }}>
              💡 How to Fix — Step by Step:
            </p>
            {hazard.solutionSteps.map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '8px',
              }}>
                <div style={{
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: `${hazard.color}25`,
                  border: `1px solid ${hazard.color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: hazard.color,
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  {i + 1}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.5', margin: 0 }}>
                  {step}
                </p>
              </div>
            ))}

            <div style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: `${hazard.color}15`,
              borderRadius: '8px',
              border: `1px solid ${hazard.color}30`,
            }}>
              <p style={{ color: hazard.color, fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>
                ✅ Solution: {hazard.solution}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HazardDetector({ instructions, onHazardsFound }) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const hazards = detectHazards(instructions);

  useEffect(() => {
    onHazardsFound(hazards);
  }, [instructions]);

  const hazardCounts = {
    data: hazards.filter(h => h.type === 'Data Hazard').length,
    control: hazards.filter(h => h.type === 'Control Hazard').length,
    structural: hazards.filter(h => h.type === 'Structural Hazard').length,
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>

      {/* Header */}
      <h2 style={{
        background: 'linear-gradient(90deg, #ef4444, #f59e0b, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        ⚠️ Hazard Detection
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px' }}>
        Click any hazard card to see detailed analysis and fix steps
      </p>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total Hazards', value: hazards.length, color: '#a78bfa', icon: '⚠️' },
          { label: 'Data Hazards', value: hazardCounts.data, color: '#ef4444', icon: '⚡' },
          { label: 'Control Hazards', value: hazardCounts.control, color: '#f59e0b', icon: '🔀' },
          { label: 'Structural', value: hazardCounts.structural, color: '#8b5cf6', icon: '🔧' },
          { label: 'Clean Instructions', value: instructions.length - new Set(hazards.map(h => h.index2)).size, color: '#10b981', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, minWidth: '100px',
            background: 'rgba(15,12,41,0.8)',
            border: `1px solid ${stat.color}30`,
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.1rem', margin: '0 0 4px' }}>{stat.icon}</p>
            <p style={{ color: stat.color, fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 2px' }}>
              {stat.value}
            </p>
            <p style={{ color: '#475569', fontSize: '0.65rem', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Instruction Overview */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.82rem', marginBottom: '12px' }}>
          📋 Instruction Overview
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {instructions.map((instr, i) => {
            const instrHazards = hazards.filter(h => h.index1 === i || h.index2 === i);
            const hasHazard = instrHazards.length > 0;
            const isSource = instrHazards.some(h => h.index1 === i);
            const isDest = instrHazards.some(h => h.index2 === i);

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: hasHazard ? 'rgba(30,41,59,0.6)' : 'rgba(16,185,129,0.05)',
                border: `1px solid ${hasHazard ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)'}`,
                borderRadius: '8px',
              }}>
                <span style={{
                  background: 'rgba(167,139,250,0.15)',
                  color: '#a78bfa',
                  borderRadius: '5px',
                  padding: '1px 7px',
                  fontSize: '0.68rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}>
                  I{i + 1}
                </span>
                <code style={{
                  color: '#e2e8f0',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  flex: 1,
                }}>
                  {instr}
                </code>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  {isSource && (
                    <span style={{
                      background: '#f59e0b20',
                      color: '#f59e0b',
                      fontSize: '0.62rem',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                    }}>
                      ⚠️ Source
                    </span>
                  )}
                  {isDest && (
                    <span style={{
                      background: '#ef444420',
                      color: '#ef4444',
                      fontSize: '0.62rem',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                    }}>
                      ⚡ Hazard
                    </span>
                  )}
                  {!hasHazard && (
                    <span style={{
                      background: '#10b98120',
                      color: '#10b981',
                      fontSize: '0.62rem',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                    }}>
                      ✅ Clean
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hazard Cards */}
      {hazards.length === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(10,8,30,0.95))',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 12px' }}>✅</p>
          <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '6px' }}>
            No Hazards Detected!
          </p>
          <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>
            Your pipeline runs smoothly — all instructions are independent!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '4px' }}>
            {hazards.length} hazard{hazards.length > 1 ? 's' : ''} found — click to expand:
          </p>
          {hazards.map((hazard, i) => (
            <HazardCard
              key={i}
              hazard={hazard}
              index={i}
              expanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default HazardDetector;