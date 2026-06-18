import React, { useState, useEffect } from 'react';

const STAGES = [
  {
    id: 'IF', label: 'Instruction Fetch', short: 'IF', icon: '📥',
    color: '#3b82f6', description: 'Program Counter sends address to Instruction Memory. Instruction is fetched.',
    component: 'Instruction\nMemory', x: 60, y: 180,
  },
  {
    id: 'ID', label: 'Instruction Decode', short: 'ID', icon: '🔍',
    color: '#8b5cf6', description: 'Control Unit decodes opcode. Register File reads source operands.',
    component: 'Register\nFile', x: 220, y: 180,
  },
  {
    id: 'EX', label: 'Execute', short: 'EX', icon: '⚙️',
    color: '#f59e0b', description: 'ALU performs operation. MUX selects operands. Result computed.',
    component: 'ALU', x: 380, y: 180,
  },
  {
    id: 'MEM', label: 'Memory Access', short: 'MEM', icon: '💾',
    color: '#10b981', description: 'Data Memory accessed for LOAD/STORE. Other instructions pass through.',
    component: 'Data\nMemory', x: 540, y: 180,
  },
  {
    id: 'WB', label: 'Write Back', short: 'WB', icon: '✍️',
    color: '#ef4444', description: 'Result written back to Register File. Instruction execution complete.',
    component: 'Register\nFile', x: 700, y: 180,
  },
];

const CPU_COMPONENTS = [
  { label: 'Program\nCounter', x: 20, y: 80, w: 70, h: 50, color: '#3b82f6', stage: 0 },
  { label: 'Control\nUnit', x: 320, y: 40, w: 80, h: 45, color: '#8b5cf6', stage: 1 },
  { label: 'MUX', x: 340, y: 160, w: 40, h: 60, color: '#f59e0b', stage: 2 },
  { label: 'ALU', x: 420, y: 155, w: 70, h: 70, color: '#f59e0b', stage: 2 },
  { label: 'Forwarding\nUnit', x: 410, y: 300, w: 90, h: 45, color: '#06b6d4', stage: 2 },
  { label: 'Hazard\nDetect', x: 160, y: 300, w: 90, h: 45, color: '#ec4899', stage: 1 },
];

function CPUAnimation({ instructions }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentInstr, setCurrentInstr] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [packetPos, setPacketPos] = useState(0);

  const instrList = instructions?.length > 0 ? instructions : ['ADD R1, R2, R3'];

  useEffect(() => {
    if (!running || done) return;
    const timer = setTimeout(() => {
      setPacketPos(p => p + 1);
      if (currentStage < STAGES.length - 1) {
        setCurrentStage(s => s + 1);
      } else {
        if (currentInstr < instrList.length - 1) {
          setCurrentInstr(i => i + 1);
          setCurrentStage(0);
          setPacketPos(0);
        } else {
          setRunning(false);
          setDone(true);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [running, currentStage, currentInstr, speed, done]);

  const handleStart = () => {
    setCurrentStage(0);
    setCurrentInstr(0);
    setDone(false);
    setPacketPos(0);
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setCurrentStage(0);
    setCurrentInstr(0);
    setDone(false);
    setPacketPos(0);
  };

  const activeStage = STAGES[currentStage];
  const progress = done ? 100 : Math.round(((currentInstr * 5 + currentStage) / (instrList.length * 5)) * 100);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>
      <h2 style={{
        background: 'linear-gradient(90deg, #43e97b, #4facfe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        🖥️ Realistic CPU Execution Visualizer
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px' }}>
        Watch instructions flow through real CPU components
      </p>

      {/* Current Instruction Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${activeStage.color}20, rgba(15,12,41,0.9))`,
        border: `1px solid ${activeStage.color}60`,
        borderRadius: '12px',
        padding: '14px 20px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: '3px' }}>
            Instruction {currentInstr + 1} / {instrList.length}
          </p>
          <p style={{ color: activeStage.color, fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {instrList[currentInstr]}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: '3px' }}>Active Stage</p>
          <p style={{ color: activeStage.color, fontWeight: 'bold' }}>
            {activeStage.icon} {activeStage.label}
          </p>
        </div>
      </div>

      {/* CPU Diagram SVG */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: '16px',
        padding: '15px',
        marginBottom: '16px',
        overflowX: 'auto',
      }}>
        <svg width="820" height="380" viewBox="0 0 820 380" style={{ display: 'block', margin: '0 auto' }}>

          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,139,250,0.05)" strokeWidth="0.5" />
            </pattern>
            {STAGES.map(s => (
              <filter key={s.id} id={`glow-${s.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>
          <rect width="820" height="380" fill="url(#grid)" />

          {/* Pipeline Bus Line */}
          <line x1="30" y1="200" x2="790" y2="200" stroke="rgba(167,139,250,0.15)" strokeWidth="2" strokeDasharray="6,4" />

          {/* Connections between stages */}
          {STAGES.map((stage, i) => {
            if (i === STAGES.length - 1) return null;
            const next = STAGES[i + 1];
            const isActive = currentStage === i && running;
            const isPassed = currentStage > i || done;
            return (
              <g key={`conn-${i}`}>
                <line
                  x1={stage.x + 80} y1={stage.y + 35}
                  x2={next.x} y2={next.y + 35}
                  stroke={isPassed ? stage.color : 'rgba(100,116,139,0.2)'}
                  strokeWidth={isPassed ? 2.5 : 1.5}
                  strokeDasharray={isActive ? '6,3' : 'none'}
                />
                {/* Arrow */}
                <polygon
                  points={`${next.x},${next.y + 35} ${next.x - 8},${next.y + 30} ${next.x - 8},${next.y + 40}`}
                  fill={isPassed ? next.color : 'rgba(100,116,139,0.3)'}
                />
              </g>
            );
          })}

          {/* PC → IF connection */}
          <line x1="90" y1="105" x2="90" y2="180" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />

          {/* Control Unit → stages */}
          <line x1="360" y1="85" x2="360" y2="160" stroke="rgba(139,92,246,0.3)" strokeWidth="1" strokeDasharray="4,3" />
          <line x1="320" y1="62" x2="200" y2="62" x2="200" y1="180" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeDasharray="4,3" />

          {/* Forwarding unit lines */}
          <line x1="455" y1="300" x2="455" y2="240" stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="455" y1="300" x2="620" y2="300" x2="620" y1="215" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="3,3" />

          {/* WB → Register File feedback */}
          <path d="M 780 215 Q 780 340 200 340 Q 200 340 200 255" stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="5,4" />
          <polygon points="200,255 195,265 205,265" fill="rgba(239,68,68,0.4)" />

          {/* Stage Blocks */}
          {STAGES.map((stage, index) => {
            const isActive = currentStage === index && !done;
            const isPassed = currentStage > index || done;
            return (
              <g key={stage.id}>
                {/* Glow effect */}
                {isActive && running && (
                  <rect
                    x={stage.x - 5} y={stage.y - 5}
                    width={90} height={80}
                    rx="12" ry="12"
                    fill={`${stage.color}20`}
                    stroke={stage.color}
                    strokeWidth="1"
                    opacity="0.6"
                    filter={`url(#glow-${stage.id})`}
                  >
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
                  </rect>
                )}

                {/* Main block */}
                <rect
                  x={stage.x} y={stage.y}
                  width={80} height={70}
                  rx="8" ry="8"
                  fill={isActive ? `${stage.color}30` : isPassed ? `${stage.color}15` : 'rgba(20,20,40,0.9)'}
                  stroke={isActive ? stage.color : isPassed ? `${stage.color}60` : 'rgba(100,116,139,0.3)'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />

                {/* Icon */}
                <text x={stage.x + 40} y={stage.y + 28} textAnchor="middle" fontSize="18">
                  {stage.icon}
                </text>

                {/* Stage short name */}
                <text
                  x={stage.x + 40} y={stage.y + 48}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill={isActive ? stage.color : isPassed ? `${stage.color}90` : '#4a5568'}
                >
                  {stage.short}
                </text>

                {/* Component name */}
                <text
                  x={stage.x + 40} y={stage.y + 62}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isActive ? `${stage.color}cc` : '#334155'}
                >
                  {stage.component}
                </text>

                {/* Stage label below */}
                <text
                  x={stage.x + 40} y={stage.y + 90}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isActive ? stage.color : '#334155'}
                >
                  {stage.label.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* CPU Sub-components */}
          {CPU_COMPONENTS.map((comp, i) => {
            const isRelated = comp.stage === currentStage && running && !done;
            return (
              <g key={i}>
                <rect
                  x={comp.x} y={comp.y}
                  width={comp.w} height={comp.h}
                  rx="6" ry="6"
                  fill={isRelated ? `${comp.color}20` : 'rgba(15,12,40,0.7)'}
                  stroke={isRelated ? comp.color : 'rgba(80,80,100,0.3)'}
                  strokeWidth={isRelated ? 1.5 : 1}
                />
                {comp.label.split('\n').map((line, li) => (
                  <text
                    key={li}
                    x={comp.x + comp.w / 2}
                    y={comp.y + comp.h / 2 + (li - (comp.label.split('\n').length - 1) / 2) * 12}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isRelated ? comp.color : '#475569'}
                    fontWeight={isRelated ? 'bold' : 'normal'}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Moving Instruction Packet */}
          {running && !done && (
            <g>
              <circle
                cx={STAGES[currentStage].x + 40}
                cy={STAGES[currentStage].y + 35}
                r="12"
                fill={activeStage.color}
                opacity="0.9"
                filter={`url(#glow-${activeStage.id})`}
              >
                <animate attributeName="r" values="10;14;10" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <text
                x={STAGES[currentStage].x + 40}
                y={STAGES[currentStage].y + 39}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#0f0c29"
              >
                I{currentInstr + 1}
              </text>
            </g>
          )}

          {/* Done checkmarks */}
          {done && STAGES.map(stage => (
            <text key={stage.id} x={stage.x + 30} y={stage.y - 8} fontSize="14">✅</text>
          ))}

          {/* Labels */}
          <text x="410" y="370" textAnchor="middle" fontSize="10" fill="rgba(167,139,250,0.4)">
            Classic 5-Stage RISC Pipeline — IF → ID → EX → MEM → WB
          </text>
        </svg>
      </div>

      {/* Stage Description */}
      <div style={{
        background: `linear-gradient(135deg, ${activeStage.color}10, rgba(15,12,41,0.8))`,
        border: `1px solid ${activeStage.color}30`,
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.5rem' }}>{activeStage.icon}</span>
        <div>
          <p style={{ color: activeStage.color, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
            {activeStage.label}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
            {activeStage.description}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
            Instruction {currentInstr + 1} of {instrList.length} — Stage {currentStage + 1}/5
          </span>
          <span style={{ color: '#a78bfa', fontSize: '0.75rem' }}>{progress}%</span>
        </div>
        <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '6px', height: '8px' }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${activeStage.color}, #764ba2)`,
            borderRadius: '6px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={handleStart}
          disabled={running}
          style={{
            padding: '10px 22px',
            background: running ? '#1e293b' : 'linear-gradient(90deg, #43e97b, #38f9d7)',
            color: running ? '#64748b' : '#0f0c29',
            border: 'none', borderRadius: '10px',
            fontWeight: 'bold', cursor: running ? 'not-allowed' : 'pointer', fontSize: '14px',
          }}
        >
          ▶ Start
        </button>

        <button
          onClick={() => setRunning(r => !r)}
          disabled={done || (currentStage === 0 && currentInstr === 0 && !running)}
          style={{
            padding: '10px 22px',
            background: 'rgba(167,139,250,0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
          }}
        >
          {running ? '⏸ Pause' : '▶ Resume'}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '10px 22px',
            background: 'rgba(239,68,68,0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
          }}
        >
          ↺ Reset
        </button>

        {/* Speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Speed:</span>
          {[{ label: '🐢 Slow', val: 1500 }, { label: '⚡ Normal', val: 900 }, { label: '🚀 Fast', val: 350 }].map(s => (
            <button
              key={s.label}
              onClick={() => setSpeed(s.val)}
              style={{
                padding: '6px 12px',
                background: speed === s.val ? 'rgba(167,139,250,0.3)' : 'rgba(30,41,59,0.8)',
                color: speed === s.val ? '#a78bfa' : '#64748b',
                border: `1px solid ${speed === s.val ? '#a78bfa' : 'rgba(100,116,139,0.2)'}`,
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem',
                fontWeight: speed === s.val ? 'bold' : 'normal',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Done Message */}
      {done && (
        <div style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg, rgba(67,233,123,0.15), rgba(56,249,215,0.15))',
          border: '1px solid rgba(67,233,123,0.3)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#43e97b', fontWeight: 'bold', fontSize: '1rem' }}>
            ✅ All {instrList.length} instructions executed successfully!
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '5px' }}>
            Without pipeline: {instrList.length * 5} cycles → With pipeline: {instrList.length + 4} cycles
          </p>
        </div>
      )}
    </div>
  );
}

export default CPUAnimation;