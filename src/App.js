import React, { useState } from 'react';
import './App.css';
import PipelineVisualizer from './components/PipelineVisualizer';
import HazardDetector from './components/HazardDetector';
import PerformanceGraph from './components/PerformanceGraph';
import AIExplainer from './components/AIExplainer';
import CPUComparison from './components/CPUComparison';
import HowItWorks from './components/HowItWorks';
import CPUAnimation from './components/CPUAnimation';

const navItems = [
  { id: 'howitworks', icon: '⚡', label: 'How It Works', alwaysOn: true },
  { id: 'cpu-anim', icon: '🎬', label: 'CPU Visualizer', alwaysOn: false },
  { id: 'pipeline', icon: '📊', label: 'Pipeline Diagram', alwaysOn: false },
  { id: 'hazard', icon: '⚠️', label: 'Hazard Detection', alwaysOn: false },
  { id: 'performance', icon: '📈', label: 'Performance', alwaysOn: false },
  { id: 'ai', icon: '🤖', label: 'AI Explainer', alwaysOn: false },
  { id: 'cpu', icon: '🖥️', label: 'CPU Comparison', alwaysOn: false },
];

function App() {
  const [instructions, setInstructions] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('howitworks');
  const [simulated, setSimulated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSimulate = () => {
    const lines = inputText.trim().split('\n').filter(Boolean);
    setInstructions(lines);
    setSimulated(true);
    setActiveTab('pipeline');
  };

  // Debug check
  console.log('Component check:', {
    PipelineVisualizer: typeof PipelineVisualizer,
    HazardDetector: typeof HazardDetector,
    PerformanceGraph: typeof PerformanceGraph,
    AIExplainer: typeof AIExplainer,
    CPUComparison: typeof CPUComparison,
    HowItWorks: typeof HowItWorks,
    CPUAnimation: typeof CPUAnimation,
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'howitworks': return <HowItWorks />;
      case 'cpu-anim': return simulated ? <CPUAnimation instructions={instructions} /> : null;
      case 'pipeline': return simulated ? <PipelineVisualizer instructions={instructions} /> : null;
      case 'hazard': return simulated ? <HazardDetector instructions={instructions} onHazardsFound={setHazards} /> : null;
      case 'performance': return simulated ? <PerformanceGraph instructions={instructions} /> : null;
      case 'ai': return simulated ? <AIExplainer hazards={hazards} instructions={instructions} /> : null;
      case 'cpu': return <CPUComparison />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '60px' : '220px',
        background: 'rgba(15,12,41,0.95)',
        borderRight: '1px solid rgba(167,139,250,0.2)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 10,
        flexShrink: 0,
      }}>

        {/* Logo */}
        <div
          style={{
            padding: '20px 15px',
            borderBottom: '1px solid rgba(167,139,250,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🚀</span>
          {!sidebarCollapsed && (
            <span style={{
              background: 'linear-gradient(90deg, #f093fb, #4facfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
            }}>
              SmartPipeline
            </span>
          )}
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '10px 0' }}>
          {navItems.map(item => {
            const isEnabled = item.alwaysOn || simulated;
            return (
              <div
                key={item.id}
                onClick={() => isEnabled && setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 15px',
                  cursor: isEnabled ? 'pointer' : 'not-allowed',
                  borderLeft: activeTab === item.id ? '3px solid #a78bfa' : '3px solid transparent',
                  background: activeTab === item.id
                    ? 'linear-gradient(90deg, rgba(167,139,250,0.2), transparent)'
                    : 'transparent',
                  transition: 'all 0.2s',
                  opacity: isEnabled ? 1 : 0.35,
                }}
                onMouseOver={e => {
                  if (isEnabled && activeTab !== item.id)
                    e.currentTarget.style.background = 'rgba(167,139,250,0.1)';
                }}
                onMouseOut={e => {
                  if (activeTab !== item.id)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <span style={{
                    color: activeTab === item.id ? '#a78bfa' : '#94a3b8',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    fontWeight: activeTab === item.id ? 'bold' : 'normal',
                  }}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        {!sidebarCollapsed && (
          <div style={{
            padding: '15px',
            borderTop: '1px solid rgba(167,139,250,0.2)',
            color: '#4a5568',
            fontSize: '0.7rem',
            textAlign: 'center',
          }}>
            DPCO Project 2026
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <div style={{
          padding: '15px 25px',
          borderBottom: '1px solid rgba(167,139,250,0.2)',
          background: 'rgba(15,12,41,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{
              background: 'linear-gradient(90deg, #f093fb, #f5576c, #4facfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.3rem',
              fontWeight: 'bold',
            }}>
              🚀 SmartPipeline Simulator
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
              AI Powered CPU Pipeline Hazard Simulator
            </p>
          </div>

          {simulated && (
            <div style={{
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: '8px',
              padding: '5px 12px',
              color: '#a78bfa',
              fontSize: '0.8rem',
            }}>
              ✅ {instructions.length} instructions loaded
            </div>
          )}
        </div>

        {/* Scrollable Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>

          {/* Input Section */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 25px',
            background: 'rgba(102,126,234,0.1)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(167,139,250,0.25)',
          }}>
            <p style={{ color: '#a78bfa', marginBottom: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              📝 Enter Assembly Instructions:
            </p>
            <textarea
              rows={4}
              placeholder={"ADD R1, R2, R3\nSUB R4, R1, R5\nLOAD R2, 100\nADD R5, R2, R4"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(15,12,41,0.9)',
                color: '#e2e8f0',
                border: '1px solid rgba(167,139,250,0.3)',
                fontSize: '13px',
                fontFamily: 'monospace',
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSimulate}
              style={{
                marginTop: '12px',
                padding: '11px 30px',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px',
                width: '100%',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.6)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)';
              }}
            >
              ▶ Simulate
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'howitworks' || activeTab === 'cpu' || simulated ? (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {renderContent()}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#4a5568' }}>
              <p style={{ fontSize: '3rem' }}>⚡</p>
              <p style={{ fontSize: '1rem', marginTop: '10px' }}>
                Enter instructions and click Simulate to begin!
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;