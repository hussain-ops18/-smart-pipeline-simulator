import React, { useState } from 'react';

const steps = [
  {
    id: 1,
    icon: '📝',
    title: 'Enter Instructions',
    color: '#f093fb',
    description: 'User enters assembly language instructions like ADD, SUB, LOAD, STORE, BEQ into the input box.',
    detail: 'Each instruction follows RISC format: OPCODE DEST, SRC1, SRC2',
    example: 'ADD R1, R2, R3\nSUB R4, R1, R5\nLOAD R2, 100',
  },
  {
    id: 2,
    icon: '⚙️',
    title: 'Parser & Decoder',
    color: '#4facfe',
    description: 'The simulator parses each instruction — extracts opcode, destination register, and source registers.',
    detail: 'Identifies register dependencies between consecutive instructions.',
    example: 'ADD R1, R2, R3\n→ Opcode: ADD\n→ Dest: R1\n→ Src: R2, R3',
  },
  {
    id: 3,
    icon: '🔄',
    title: 'Pipeline Stages',
    color: '#43e97b',
    description: 'Each instruction passes through 5 stages: IF → ID → EX → MEM → WB in parallel.',
    detail: 'Multiple instructions execute simultaneously in different stages.',
    example: 'Cycle 1: I1=IF\nCycle 2: I1=ID, I2=IF\nCycle 3: I1=EX, I2=ID, I3=IF',
  },
  {
    id: 4,
    icon: '⚠️',
    title: 'Hazard Detection',
    color: '#f5576c',
    description: 'Algorithm checks for Data, Control, and Structural hazards between instructions.',
    detail: 'Compares destination registers of previous instructions with source registers of current.',
    example: 'ADD R1, R2, R3  ← writes R1\nSUB R4, R1, R5  ← reads R1\n⚡ DATA HAZARD!',
  },
  {
    id: 5,
    icon: '💡',
    title: 'Solution Applied',
    color: '#f59e0b',
    description: 'Simulator suggests stalling, forwarding, or branch prediction based on hazard type.',
    detail: 'Stalling inserts bubble cycles. Forwarding bypasses writeback stage.',
    example: 'Data Hazard Solution:\n→ Insert 2 stall cycles\n→ OR use forwarding path',
  },
  {
    id: 6,
    icon: '📈',
    title: 'Performance Analysis',
    color: '#a78bfa',
    description: 'Calculates CPI, Speedup, and Efficiency comparing pipelined vs non-pipelined execution.',
    detail: 'Speedup = Without Pipeline Cycles / With Pipeline Cycles',
    example: '4 instructions:\nWithout: 20 cycles\nWith: 8 cycles\nSpeedup: 2.5x',
  },
  {
    id: 7,
    icon: '🤖',
    title: 'AI Explanation',
    color: '#00f2fe',
    description: 'AI (LLaMA 3.3) analyzes detected hazards and explains them in simple educational language.',
    detail: 'Powered by Groq API — fast inference for real-time explanations.',
    example: 'AI explains:\n→ Why hazard occurred\n→ Impact on performance\n→ Best solution',
  },
];

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>
      <h2 style={{
        background: 'linear-gradient(90deg, #f093fb, #4facfe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '8px',
      }}>
        ⚡ How It Works
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '25px' }}>
        Click on any step to see details
      </p>

      {steps.map((step, index) => (
        <div key={step.id} style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>

          {/* Left circle + line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: activeStep === step.id
                  ? `linear-gradient(135deg, ${step.color}, #0f0c29)`
                  : 'rgba(15,12,41,0.9)',
                border: `2px solid ${step.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: activeStep === step.id ? `0 0 15px ${step.color}` : 'none',
                flexShrink: 0,
              }}
            >
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div style={{
                width: '2px',
                flex: 1,
                minHeight: '20px',
                background: `linear-gradient(${step.color}, ${steps[index + 1].color})`,
                margin: '4px 0',
                opacity: 0.4,
              }} />
            )}
          </div>

          {/* Right content */}
          <div style={{ flex: 1, paddingBottom: '8px' }}>
            <div
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              style={{
                background: 'rgba(15,12,41,0.6)',
                border: `1px solid ${activeStep === step.id ? step.color : 'rgba(167,139,250,0.15)'}`,
                borderRadius: '12px',
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: step.color,
                    color: '#0f0c29',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                  }}>
                    STEP {step.id}
                  </span>
                  <span style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    {step.title}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {activeStep === step.id ? '▲' : '▼'}
                </span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.83rem', marginTop: '8px', lineHeight: '1.5' }}>
                {step.description}
              </p>

              {activeStep === step.id && (
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    flex: 1,
                    minWidth: '200px',
                    background: 'rgba(167,139,250,0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(167,139,250,0.2)',
                  }}>
                    <p style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
                      💡 How it works:
                    </p>
                    <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.6' }}>
                      {step.detail}
                    </p>
                  </div>
                  <div style={{
                    flex: 1,
                    minWidth: '200px',
                    background: 'rgba(15,12,41,0.8)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: `1px solid ${step.color}40`,
                  }}>
                    <p style={{ color: step.color, fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
                      📌 Example:
                    </p>
                    <pre style={{
                      color: '#e2e8f0',
                      fontSize: '0.78rem',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      margin: 0,
                    }}>
                      {step.example}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div style={{
        marginTop: '20px',
        background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(167,139,250,0.25)',
        textAlign: 'center',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', marginBottom: '8px' }}>🎯 Project Summary</p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.7' }}>
          SmartPipeline Simulator combines classical Computer Organization concepts with modern AI to create
          an interactive, educational tool for understanding CPU pipeline hazards.
          Built with React + Node.js + Groq AI (LLaMA 3.3).
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          {['React', 'Node.js', 'Groq AI', 'LLaMA 3.3', 'DPCO'].map(tag => (
            <span key={tag} style={{
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: '20px',
              padding: '4px 14px',
              color: '#a78bfa',
              fontSize: '0.78rem',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;