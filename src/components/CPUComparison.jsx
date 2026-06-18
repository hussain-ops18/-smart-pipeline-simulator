import React, { useState } from 'react';

const cpuData = {
  'Intel i7 (Haswell)': {
    stages: 14,
    frequency: '3.4 GHz',
    cores: 4,
    threads: 8,
    cache: '8MB L3',
    hazardHandling: 'Out-of-order execution + Branch prediction',
    forwarding: 'Yes',
    branchPrediction: 'Tournament predictor',
    color: '#3b82f6',
    icon: '🔵',
    year: '2013',
    transistors: '1.4 Billion',
    description: 'Deep pipeline with advanced hazard handling. High performance server/desktop CPU.',
    coreLayout: { rows: 2, cols: 2 },
    strengths: ['High single-thread performance', 'Advanced branch prediction', 'Out-of-order execution', 'Hyper-threading'],
    weaknesses: ['High power consumption', 'Complex pipeline = more hazards', 'Expensive to manufacture'],
    architecture: 'x86-64',
  },
  'ARM Cortex-A53': {
    stages: 8,
    frequency: '1.5 GHz',
    cores: 4,
    threads: 4,
    cache: '512KB L2',
    hazardHandling: 'In-order execution + Static branch prediction',
    forwarding: 'Yes',
    branchPrediction: 'Static (limited)',
    color: '#10b981',
    icon: '🟢',
    year: '2012',
    transistors: '~500 Million',
    description: 'Balanced pipeline for mobile devices. Power efficient with moderate performance.',
    coreLayout: { rows: 2, cols: 2 },
    strengths: ['Low power consumption', 'Simple pipeline', 'Great for mobile', 'Cost effective'],
    weaknesses: ['Lower single-thread performance', 'Limited branch prediction', 'In-order only'],
    architecture: 'ARMv8-A',
  },
  'Our Simulator': {
    stages: 5,
    frequency: 'Educational',
    cores: 1,
    threads: 1,
    cache: 'None',
    hazardHandling: 'Stalling + Basic forwarding',
    forwarding: 'Yes',
    branchPrediction: 'None',
    color: '#f59e0b',
    icon: '🟡',
    year: '2026',
    transistors: 'Virtual',
    description: 'Classic 5-stage RISC pipeline. Perfect for learning CPU architecture concepts!',
    coreLayout: { rows: 1, cols: 1 },
    strengths: ['Easy to understand', 'Educational tool', 'Visualizable', 'No complexity'],
    weaknesses: ['Single core only', 'No branch prediction', 'Basic hazard handling'],
    architecture: 'RISC (Custom)',
  },
};

function CoreDiagram({ cpu, data }) {
  const { rows, cols } = data.coreLayout;
  const isActive = true;

  return (
    <div style={{
      background: 'rgba(10,8,30,0.9)',
      border: `1px solid ${data.color}40`,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <p style={{ color: data.color, fontWeight: 'bold', fontSize: '0.82rem', marginBottom: '12px' }}>
        🏗️ Core Architecture Diagram
      </p>

      {/* CPU Package */}
      <div style={{
        border: `2px solid ${data.color}60`,
        borderRadius: '12px',
        padding: '12px',
        background: `${data.color}08`,
        position: 'relative',
      }}>
        {/* CPU Label */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '12px',
          background: data.color,
          color: '#0f0c29',
          fontSize: '0.65rem',
          fontWeight: 'bold',
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          {cpu}
        </div>

        {/* Cores Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '8px',
          marginBottom: '10px',
          marginTop: '6px',
        }}>
          {Array.from({ length: rows * cols }, (_, i) => (
            <div key={i} style={{
              background: `${data.color}20`,
              border: `1px solid ${data.color}50`,
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
            }}>
              <p style={{ color: data.color, fontSize: '0.68rem', fontWeight: 'bold', margin: '0 0 4px' }}>
                Core {i}
              </p>

              {/* Pipeline stages inside core */}
              <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                {['IF', 'ID', 'EX', 'MEM', 'WB'].slice(0, Math.min(data.stages, 5)).map((s, si) => (
                  <div key={s} style={{
                    background: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][si],
                    borderRadius: '2px',
                    padding: '1px 3px',
                    fontSize: '0.45rem',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                    {s}
                  </div>
                ))}
                {data.stages > 5 && (
                  <div style={{
                    background: 'rgba(167,139,250,0.3)',
                    borderRadius: '2px',
                    padding: '1px 3px',
                    fontSize: '0.45rem',
                    color: '#a78bfa',
                  }}>
                    +{data.stages - 5}
                  </div>
                )}
              </div>

              {/* L1 Cache */}
              <div style={{
                background: 'rgba(167,139,250,0.1)',
                border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: '4px',
                padding: '2px 4px',
                fontSize: '0.55rem',
                color: '#94a3b8',
              }}>
                L1 Cache
              </div>
            </div>
          ))}
        </div>

        {/* Shared Components */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { label: `L2/L3: ${data.cache}`, color: '#6366f1' },
            { label: `${data.frequency}`, color: '#f59e0b' },
            { label: `${data.architecture}`, color: '#10b981' },
            { label: `${data.transistors}`, color: '#ef4444' },
          ].map(item => (
            <div key={item.label} style={{
              background: `${item.color}15`,
              border: `1px solid ${item.color}30`,
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.6rem',
              color: item.color,
              fontWeight: 'bold',
            }}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Pipeline Depth Visual */}
        <div style={{ marginTop: '10px' }}>
          <p style={{ color: '#475569', fontSize: '0.62rem', marginBottom: '4px' }}>
            Pipeline Depth ({data.stages} stages):
          </p>
          <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: data.stages }, (_, i) => (
              <div key={i} style={{
                flex: 1,
                height: '8px',
                background: `hsl(${(i / data.stages) * 260}, 70%, 60%)`,
                borderRadius: '2px',
                opacity: 0.8,
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CPUComparison() {
  const [selected, setSelected] = useState('Our Simulator');
  const [compareMode, setCompareMode] = useState(false);

  const selectedData = cpuData[selected];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>

      {/* Header */}
      <h2 style={{
        background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        🖥️ CPU Pipeline Comparison
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px' }}>
        Compare real CPUs with our simulator — click a CPU to explore!
      </p>

      {/* CPU Selector Cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Object.entries(cpuData).map(([name, data]) => (
          <div
            key={name}
            onClick={() => setSelected(name)}
            style={{
              flex: 1, minWidth: '200px',
              background: selected === name
                ? `linear-gradient(135deg, ${data.color}25, rgba(15,12,41,0.95))`
                : 'rgba(15,12,41,0.8)',
              border: `2px solid ${selected === name ? data.color : data.color + '30'}`,
              borderRadius: '14px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: selected === name ? `0 0 20px ${data.color}30` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{data.icon}</span>
              <div>
                <p style={{ color: data.color, fontWeight: 'bold', fontSize: '0.85rem', margin: 0 }}>
                  {name}
                </p>
                <p style={{ color: '#475569', fontSize: '0.68rem', margin: 0 }}>{data.year}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Stages', value: data.stages },
                { label: 'Cores', value: data.cores },
                { label: 'Freq', value: data.frequency },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ color: '#475569', fontSize: '0.7rem' }}>{item.label}</span>
                  <span style={{ color: selected === name ? data.color : '#94a3b8', fontSize: '0.72rem', fontWeight: 'bold' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {selected === name && (
              <div style={{
                marginTop: '8px',
                background: `${data.color}20`,
                borderRadius: '6px',
                padding: '3px 8px',
                textAlign: 'center',
              }}>
                <span style={{ color: data.color, fontSize: '0.68rem', fontWeight: 'bold' }}>
                  ✓ Selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Core Diagram */}
      <CoreDiagram cpu={selected} data={selectedData} />

      {/* Detail Panel */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: `1px solid ${selectedData.color}30`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '2rem' }}>{selectedData.icon}</span>
          <div>
            <p style={{ color: selectedData.color, fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
              {selected}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
              {selectedData.description}
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            { label: 'Pipeline Stages', value: selectedData.stages, icon: '🔄' },
            { label: 'Cores', value: selectedData.cores, icon: '⚙️' },
            { label: 'Threads', value: selectedData.threads, icon: '🧵' },
            { label: 'Frequency', value: selectedData.frequency, icon: '⚡' },
            { label: 'Cache', value: selectedData.cache, icon: '💾' },
            { label: 'Architecture', value: selectedData.architecture, icon: '🏗️' },
            { label: 'Transistors', value: selectedData.transistors, icon: '🔬' },
            { label: 'Forwarding', value: selectedData.forwarding, icon: '🔀' },
          ].map(spec => (
            <div key={spec.label} style={{
              flex: '1',
              minWidth: '100px',
              background: 'rgba(30,41,59,0.6)',
              border: `1px solid ${selectedData.color}20`,
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '1rem', margin: '0 0 4px' }}>{spec.icon}</p>
              <p style={{ color: selectedData.color, fontWeight: 'bold', fontSize: '0.82rem', margin: '0 0 2px' }}>
                {spec.value}
              </p>
              <p style={{ color: '#475569', fontSize: '0.62rem', margin: 0 }}>{spec.label}</p>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1, minWidth: '200px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '10px',
            padding: '14px',
          }}>
            <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.78rem', marginBottom: '10px' }}>
              ✅ Strengths
            </p>
            {selectedData.strengths.map(s => (
              <div key={s} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <span style={{ color: '#10b981', fontSize: '0.72rem', flexShrink: 0 }}>▸</span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{
            flex: 1, minWidth: '200px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px',
            padding: '14px',
          }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.78rem', marginBottom: '10px' }}>
              ❌ Weaknesses
            </p>
            {selectedData.weaknesses.map(w => (
              <div key={w} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <span style={{ color: '#ef4444', fontSize: '0.72rem', flexShrink: 0 }}>▸</span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{w}</span>
              </div>
            ))}
          </div>

          <div style={{
            flex: 1, minWidth: '200px',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: '10px',
            padding: '14px',
          }}>
            <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.78rem', marginBottom: '10px' }}>
              ⚠️ Hazard Handling
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: '1.6', margin: 0 }}>
              {selectedData.hazardHandling}
            </p>
            <p style={{ color: '#6366f1', fontSize: '0.72rem', marginTop: '8px', fontWeight: 'bold' }}>
              Branch Prediction:
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.73rem', margin: '2px 0 0' }}>
              {selectedData.branchPrediction}
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Depth Comparison */}
      <div style={{
        background: 'rgba(10,8,30,0.95)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '16px' }}>
          📊 Pipeline Depth Comparison
        </p>
        {Object.entries(cpuData).map(([name, data]) => (
          <div key={name} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{data.icon}</span>
                <span style={{ color: name === selected ? data.color : '#64748b', fontSize: '0.78rem', fontWeight: name === selected ? 'bold' : 'normal' }}>
                  {name}
                </span>
              </div>
              <span style={{ color: data.color, fontSize: '0.78rem', fontWeight: 'bold' }}>
                {data.stages} stages
              </span>
            </div>
            <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: '6px', height: '24px', overflow: 'hidden' }}>
              <div style={{
                width: `${(data.stages / 14) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${data.color}, ${data.color}88)`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '8px',
                transition: 'width 0.8s ease',
              }}>
                <span style={{ color: 'white', fontSize: '0.62rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {data.stages} stages
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Insight */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '14px',
        padding: '18px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>🎯</span>
        <div>
          <p style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '6px' }}>
            Key Insight
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.7', margin: 0 }}>
            More pipeline stages = higher clock frequency possible, but more hazards to handle!
            Intel i7 uses <strong style={{ color: '#3b82f6' }}>14 stages</strong> for maximum performance,
            ARM Cortex-A53 uses <strong style={{ color: '#10b981' }}>8 stages</strong> for power efficiency,
            and our classic <strong style={{ color: '#f59e0b' }}>5-stage</strong> pipeline is perfect for learning
            the fundamental concepts of CPU architecture! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default CPUComparison;