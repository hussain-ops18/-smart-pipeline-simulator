import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px' }}>

      {/* Header */}
      <h2 style={{
        background: 'linear-gradient(90deg, #a78bfa, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '4px',
      }}>
        ⚙️ About This Project
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '24px' }}>
        Information about the creator and purpose of this site
      </p>

      {/* Author Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(15,12,41,0.95))',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '18px',
        padding: '24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: 'white',
          flexShrink: 0,
          boxShadow: '0 0 25px rgba(99,102,241,0.5)',
        }}>
          KH
        </div>
        <div>
          <p style={{ color: '#a78bfa', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>
            CREATED BY
          </p>
          <p style={{ color: '#e2e8f0', fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
            Khadhar Hussain A
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
            Developer • DPCO Mini Project 2026
          </p>
        </div>
      </div>

      {/* Why this site */}
      <div style={{
        background: 'rgba(15,12,41,0.8)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '16px',
        padding: '22px',
        marginBottom: '20px',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '14px' }}>
          🎯 Why I Built This
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '14px' }}>
          CPU Pipelining is one of the toughest topics in <strong style={{ color: '#e2e8f0' }}>Digital Principles & Computer Organization (DPCO)</strong> —
          textbooks explain it with static diagrams that are hard to visualize. I built SmartPipeline Simulator
          to turn that theory into something you can actually <em style={{ color: '#a78bfa' }}>see and interact with</em>.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.8' }}>
          Instead of just reading about Data, Control & Structural hazards, you can enter your own instructions
          and watch the pipeline execute in real-time, see hazards get detected automatically, and even chat
          with an AI tutor that explains exactly what's happening — like having a personal teacher for computer
          architecture. 🚀
        </p>
      </div>

      {/* Goals Grid */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { icon: '📚', title: 'Make Learning Visual', desc: 'Turn abstract pipeline theory into interactive visuals', color: '#3b82f6' },
          { icon: '🤖', title: 'AI-Assisted Teaching', desc: 'Get instant, simple explanations for every concept', color: '#a78bfa' },
          { icon: '⚡', title: 'Hands-on Practice', desc: 'Test your own instructions and see real hazard detection', color: '#10b981' },
        ].map(goal => (
          <div key={goal.title} style={{
            flex: 1, minWidth: '180px',
            background: 'rgba(15,12,41,0.8)',
            border: `1px solid ${goal.color}30`,
            borderRadius: '14px',
            padding: '16px',
          }}>
            <p style={{ fontSize: '1.4rem', margin: '0 0 8px' }}>{goal.icon}</p>
            <p style={{ color: goal.color, fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>
              {goal.title}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', lineHeight: '1.5', margin: 0 }}>
              {goal.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div style={{
        background: 'rgba(15,12,41,0.8)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: '16px',
        padding: '20px',
      }}>
        <p style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>
          🛠️ Built With
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['React.js', 'Node.js', 'Express', 'Groq AI (LLaMA 3.3)', 'Netlify', 'Render'].map(tech => (
            <span key={tech} style={{
              background: 'rgba(167,139,250,0.12)',
              border: '1px solid rgba(167,139,250,0.25)',
              borderRadius: '20px',
              padding: '5px 14px',
              color: '#a78bfa',
              fontSize: '0.78rem',
              fontWeight: 'bold',
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <p style={{ color: '#334155', fontSize: '0.72rem', textAlign: 'center', marginTop: '20px' }}>
        © 2026 Khadhar Hussain A — Built for DPCO Mini Project
      </p>
    </div>
  );
}

export default About;