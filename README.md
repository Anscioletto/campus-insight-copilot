# SAQO — Operational Quality Assistance System: Lean Management & AI Integration

An A3 Analysis and RAG (Retrieval-Augmented Generation) Implementation with a Human-in-the-Loop Paradigm for Optimizing Quality Control Processes (ISO 9001) at Fondazione UniSA.

---

## 📋 Overview

This project addresses the redesign and optimization of the quality management process for outsourced services (cleaning, green space maintenance, catering) at Fondazione UniSA. Combining **Lean Management** principles (A3 Report, Mendelow Stakeholder Matrix, Ishikawa, 5 Whys) with **Generative Artificial Intelligence**, the system resolves inefficiencies related to manual information retrieval and fragmented Non-Conformity (NC) management[cite: 1].

Through an AI assistant powered by **Retrieval-Augmented Generation (RAG)** and deployed via a mobile Progressive Web App (PWA), quality inspectors gain instant access to technical specifications and contract terms, while automatically generating structured non-conformity drafts — always keeping human oversight at the core of decision-making (*Human-in-the-Loop*)[cite: 1].

---

## 🏗️ System Architecture

The SAQO platform is structured across four integrated functional layers[cite: 1]:

1. **RAG Knowledge Base (Layer 1)**: Indexed repository containing technical specifications, supplier proposals, ISO 9001 procedures, and historical inspection checklists (achieving a 98.7% grounding rate)[cite: 1].
2. **AI Core (Layer 2)**: Powered by the Anthropic Claude API for semantic search, natural language understanding, and contextual response generation[cite: 1].
3. **Operational Interface (Layer 3)**: A Progressive Web App (PWA) tailored for field inspections on mobile devices, featuring pre-configured *Quick Prompts* for rapid querying[cite: 1].
4. **Visual Management & Alerting (Layer 4)**: A real-time traffic-light dashboard (Red / Yellow / Green) for tracking documentation deadlines, inspection checklists, open NCs, and corrective action workflows[cite: 1].

---

## 📊 Performance Metrics (AS-IS vs TO-BE)

Implementation of the SAQO system drastically improved key process performance indicators[cite: 1]:

| KPI / Performance Metric | AS-IS State | TO-BE State | Variation |
| :--- | :--- | :--- | :--- |
| **NC Cycle Lead-Time** | 52 hours | 3.5 hours | **-93%**[cite: 1] |
| **NC Drafting Time** | 45 minutes | 4 minutes | **-91%**[cite: 1] |
| **Document Search Time** | 32 minutes | 1.5 minutes | **-95%**[cite: 1] |
| **Formal Errors in NCs** | 35% | 3% | **-91%**[cite: 1] |
| **Monthly Reporting Time** | 3.5 hours | 22 minutes | **-90%**[cite: 1] |
| **User Satisfaction (Cleaning Pilot)** | 78% | 89% | **+11%**[cite: 1] |

* **Return on Investment (ROI)**: 333% in Year 1[cite: 1]
* **Payback Period**: Less than 3 months post go-live[cite: 1]
* **Projected Annual Savings**: ~€19,900[cite: 1]

---

## 💡 Key Takeaways

* **Human-in-the-Loop Integration**: AI does not replace decision-making authority; instead, it empowers human inspectors with accurate norm references and automated drafts, effectively eliminating cultural resistance to change[cite: 1].
* **Elimination of Root Causes**: Applying the 5 Whys technique revealed that transitioning from manual document retrieval to proactive, automated information flows removes single-point-of-failure dependencies on individual quality managers[cite: 1].
* **High Grounding Accuracy**: The RAG architecture lowered the hallucination rate to 1.3%, ensuring high legal and procedural compliance for all issued non-conformities[cite: 1].

---

## 🛠️ Tech Stack

* **AI Core & RAG**: Anthropic Claude API, Retrieval-Augmented Generation (RAG)[cite: 1]
* **Frontend & Mobile**: Progressive Web App (PWA)[cite: 1]
* **Process Methodology**: Lean Management, A3 Thinking, Ishikawa (Fishbone) Diagrams, 5 Whys, Visual Management[cite: 1]
* **Quality Framework**: ISO 9001 Standards[cite: 1]

---

## 📁 Repository Structure

```text
.
├── saqo_rag_pipeline.py     # Document indexing & RAG Knowledge Base management pipeline
├── pwa_interface/           # Source code for the Progressive Web App
├── relazione_SAQO.pdf       # Final project report & A3 Report documentation
└── README.md
