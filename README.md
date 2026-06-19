# 🚀 SmartPipeline Simulator

### AI-Powered CPU Pipeline Hazard Simulator

A DPCO (Digital Principles & Computer Organization) mini-project that visualizes how CPU pipelining works, detects hazards in real-time, and uses AI to explain everything in simple terms.

🔗 **Live Demo:** [https://smart-pipeline-simulator.netlify.app](https://smart-pipeline-simulator.netlify.app)

---

## ✨ Features

- **📊 Pipeline Diagram** — Visualizes 5-stage RISC pipeline (IF → ID → EX → MEM → WB) execution cycle by cycle
- **🎬 CPU Visualizer** — Realistic animated CPU architecture showing instruction flow through real components
- **⚠️ Hazard Detection** — Automatically detects Data, Control & Structural hazards with detailed fix steps
- **📈 Performance Analysis** — Compares pipelined vs non-pipelined execution with speedup & efficiency metrics
- **🤖 AI Pipeline Assistant** — Chat-based AI (powered by Groq LLaMA 3.3) that auto-explains your pipeline and answers questions
- **🖥️ CPU Comparison** — Compares our simulator with real-world CPUs (Intel i7, ARM Cortex-A53)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express |
| AI | Groq API (LLaMA 3.3 70B) |
| Hosting | Netlify (Frontend) + Render (Backend) |

---

## 📝 How to Use

1. Enter assembly instructions in the input box (e.g. `ADD R1, R2, R3`)
2. Click **▶ Simulate**
3. Explore the sidebar tabs — Pipeline Diagram, Hazard Detection, Performance, AI Explainer, CPU Comparison
4. Ask the AI Assistant anything about your pipeline!

### Example Instructions:
