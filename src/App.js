import React, { useState, useEffect } from 'react';
import './App.css';
import PipelineVisualizer from './components/PipelineVisualizer';
import HazardDetector from './components/HazardDetector';
import PerformanceGraph from './components/PerformanceGraph';
import AIExplainer from './components/AIExplainer';
import CPUComparison from './components/CPUComparison';
import HowItWorks from './components/HowItWorks';
import CPUAnimation from './components/CPUAnimation';
import About from './components/About';

const navItems = [
  { id: 'howitworks', icon: '⚡', label: 'How It Works', alwaysOn: true },
  { id: 'cpu-anim', icon: '🎬', label: 'CPU Visualizer', alwaysOn: false },
  { id: 'pipeline', icon: '📊', label: 'Pipeline Diagram', alwaysOn: false },
  { id: 'hazard', icon: '⚠️', label: 'Hazard Detection', alwaysOn: false },
  { id: 'performance', icon: '📈', label: 'Performance', alwaysOn: false },
  { id: 'ai', icon: '🤖', label: 'AI Explainer', alwaysOn: false },
  { id: 'cpu', icon: '🖥️', label: 'CPU Comparison', alwaysOn: false },
  { id: 'about', icon: '⚙️', label: 'About', alwaysOn: true },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function App() {
  const isMobile = useIsMobile();
  const [instructions, setInstructions] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('howitworks');
  const [simulated, setSimulated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSimulate = () => {
    const lines = inputText.trim().split('\n').filter(Boolean);
    setInstructions(lines);
    setSimulated(true);
    setActiveTab('pipeline');
    if (isMobile) setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'howitworks': return <HowItWorks />;
      case 'cpu-anim': return simulated ? <CPUAnimation instructions={instructions} /> : null;
      case 'pipeline': return simulated ? <PipelineVisualizer instructions={instructions} /> : null;
      case 'hazard': return simulated ? <HazardDetector instructions={instructions} onHazardsFound={setHazards} /> : null;
      case 'performance': return simulated ? <PerformanceGraph instructions={instructions} /> : null;
      case 'ai': return simulated ? <AIExplainer hazards={hazards} instructions={instructions} /> : null;
      case 'cpu': return <CPUComparison />;
      case 'about': return <About />;
      default: return null;
    }
  };

  const showSidebar = !isMobile || sidebarOpen;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Mobile overlay (click to close sidebar) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 19,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: 'rgba(15,12,41,0.98)',
        borderRight: '1px solid rgba(167,139,250,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        ...(isMobile
          ? {
              position: 'fixed',
              top: 0, bottom: 0, left: 0,
              zIndex: 20,
              transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s ease',
              height: '100vh',
            }
          : { position: 'relative' }),
      }}>

        {/* Logo */}
        <div
          style={{
            padding: '20px 15px',
            borderBottom: '1px solid rgba(167,139,250,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🚀</span>
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
          </div>
          {isMobile && (
            <span
              onClick={() => setSidebarOpen(false)}
              style={{ color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </span>
          )}
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const isEnabled = item.alwaysOn || simulated;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isEnabled) return;
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 15px',
                  cursor: isEnabled ? 'pointer' : 'not-allowed',
                  borderLeft: activeTab === item.id ? '3px solid #a78bfa' : '3px solid transparent',
                  background: activeTab === item.id
                    ? 'linear-gradient(90deg, rgba(167,139,250,0.2), transparent)'
                    : 'transparent',
                  transition: 'all 0.2s',
                  opacity: isEnabled ? 1 : 0.35,
                }}
              >
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{
                  color: activeTab === item.id ? '#a78bfa' : '#94a3b8',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  fontWeight: activeTab === item.id ? 'bold' : 'normal',
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <div style={{
          padding: '15px',
          borderTop: '1px solid rgba(167,139,250,0.2)',
          color: '#4a5568',
          fontSize: '0.7rem',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          DPCO Project 2026
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
      }}>

        {/* Top Bar */}
        <div style={{
          padding: isMobile ? '12px 14px' : '15px 25px',
          borderBottom: '1px solid rgba(167,139,250,0.2)',
          background: 'rgba(15,12,41,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {isMobile && (
              <span
                onClick={() => setSidebarOpen(true)}
                style={{ fontSize: '1.4rem', color: '#a78bfa', cursor: 'pointer', flexShrink: 0 }}
              >
                ☰
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                background: 'linear-gradient(90deg, #f093fb, #f5576c, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: isMobile ? '1rem' : '1.3rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0,
              }}>
                🚀 SmartPipeline
              </h1>
              {!isMobile && (
                <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                  AI Powered CPU Pipeline Hazard Simulator
                </p>
              )}
            </div>
          </div>

          {simulated && (
            <div style={{
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: '8px',
              padding: isMobile ? '4px 8px' : '5px 12px',
              color: '#a78bfa',
              fontSize: isMobile ? '0.68rem' : '0.8rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              ✅ {instructions.length}
            </div>
          )}
        </div>

        {/* Scrollable Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isMobile ? '14px' : '25px',
          width: '100%',
          boxSizing: 'border-box',
        }}>

          {/* Input Section */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 25px',
            background: 'rgba(102,126,234,0.1)',
            borderRadius: '16px',
            padding: isMobile ? '14px' : '20px',
            border: '1px solid rgba(167,139,250,0.25)',
            boxSizing: 'border-box',
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
                boxSizing: 'border-box',
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
              }}
            >
              ▶ Simulate
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'howitworks' || activeTab === 'cpu' || activeTab === 'about' || simulated ? (
            <div style={{ animation: 'fadeIn 0.3s ease', width: '100%' }}>
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