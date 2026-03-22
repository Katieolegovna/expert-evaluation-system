# 🛩️ Expert Evaluation System for Strategic Scenarios - Sheremetyevo Airport

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge&logo=github)](https://katieolegovna.github.io/expert-evaluation-system/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

Interactive web application for expert analysis of strategic scenarios for non-aviation services development at Sheremetyevo International Airport until 2031, using BSC (Balanced Scorecard) methodology and Kendall's concordance coefficient.

## 🚀 Demo

[Open Application](https://katieolegovna.github.io/expert-evaluation-system/)

## ✨ Key Features

### 📊 Expert Analysis
- **Anonymous expert surveys** with data validation across 12 criteria
- **Automatic calculation** of Kendall's concordance coefficient
- **Multi-criteria analysis** using BSC methodology (4 perspectives)
- **Statistical significance testing** of expert agreement

### 📈 Visualization & Analysis
- **Interactive charts** and result graphs
- **Sensitivity analysis** by weight coefficients
- **Risk matrix** with probability and impact assessment
- **Clickable calculations** with detailed formulas

### 👥 Data Management
- **Expert database** with detailed survey viewing
- **Auto-generated data** for demonstration
- **Result export** in convenient format

### 🎨 User Interface
- **Dark and light themes**
- **Bilingual support** (Russian and English)
- **Responsive design** for all devices
- **Animated elements** (background airplanes)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Mathematics**: Kendall's concordance coefficient, χ² Pearson test
- **Methodology**: Balanced Scorecard (BSC), multi-criteria analysis
- **Visualization**: Canvas API for interactive charts
- **Dependencies**: None - fully autonomous application

## 📋 Functional Modules

### 📝 Expert Survey Module
- Anonymous evaluation of 3 scenarios across 12 criteria (1-5 scale)
- Scenario ranking by preference
- Data validation and completeness checking
- Automatic result saving

### 📊 Analytics Module
- **Weight coefficients**: Calculation of absolute sub-criteria weights
- **Integral scores**: Weighted scenario evaluations
- **Concordance coefficient**: Kendall's W with significance testing
- **Ranking analysis**: Average ranks and preference distribution

### 🔍 Risk Assessment Module
- 23 specific risks across 5 categories:
  - 💻 Technological risks (5 risks)
  - 👥 Organizational risks (5 risks)
  - 📈 Market risks (4 risks)
  - 📜 Regulatory risks (4 risks)
  - 💰 Financial risks (5 risks)
- "Probability × Impact" matrix
- Criticality level distribution visualization

### 👥 Expert Management Module
- Expert list with filtering capabilities
- Detailed survey viewing for each expert
- Statistics by specialization and experience
- Test data generation for demonstration

## 🚀 Quick Start

### Local Setup
```bash
# Clone repository
git clone https://github.com/Katieolegovna/expert-evaluation-system.git

# Navigate to project folder
cd expert-evaluation-system

# Start local server (any option)
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000

# Open in browser
http://localhost:8000
```

### Online Demo
🌐 **[Open Application](https://katieolegovna.github.io/expert-evaluation-system/)**

### System Requirements
- Modern browser with ES6+ support
- JavaScript enabled
- Screen resolution from 1024×768

## 📝 User Guide

### For Experts
1. 📋 **Fill the survey**: Enter your data and work experience
2. ⭐ **Rate scenarios**: Evaluate each of 12 criteria (1-5 scale)
3. 🏆 **Rank scenarios**: Order scenarios by preference
4. ✅ **Submit**: Data will be automatically saved

### For Analysts
1. 📊 **View results**: "Analysis Results" tab
2. 🔍 **Study details**: Click "📊 Calculation" buttons for formulas
3. ⚠️ **Assess risks**: "Risk Assessment" tab
4. 📋 **Read conclusions**: "Final Conclusion" tab

### Interactive Elements
- **🌓 Theme toggle**: Button in top-right corner
- **🌐 Language switch**: RU/EN toggle
- **📊 Clickable calculations**: Detailed formulas in modal windows
- **👥 Expert database**: View detailed surveys

## 🎯 Key Implementation Features

### 1. 📊 Mathematical Framework
- **Kendall's concordance coefficient**: W = 12S/[n²(m³-m)]
- **χ² Pearson test**: Significance testing at α = 0.05
- **Weighted integral scores**: I = Σ(wi × xi)
- **Sensitivity analysis**: Weight variation ±10%

### 2. 🎨 Visual Enhancements
- ✈️ **Animated airplanes** in background (10 elements)
- 🏛️ **NUST MISiS branding** and Sheremetyevo airport
- 🌓 **Adaptive dark theme** with smooth transitions
- 📱 **Responsive design** for mobile devices

### 3. 🔧 Interactivity
- **Modal windows** with detailed calculations and formulas
- **Clickable elements** for methodology exploration
- **Real-time form validation**
- **Auto-save** theme and language settings

### 4. 📈 Analytical Capabilities
- **Automatic generation** of 20 experts with realistic data
- **Statistical conclusions** after each results table
- **Risk matrix** with color-coded criticality indicators
- **Comparative analysis** of scenarios across all criteria

## 📁 Project Structure

```
📦 expert-evaluation-system/
├── 📄 index.html              # Main application page
├── 📜 script.js               # Core logic and mathematical calculations
├── 🎨 styles.css              # Styles and visual design
├── 🏛️ logo-university.svg     # NUST MISiS logo
├── 🛩️ favicon.svg             # Site icon (airplane)
├── 📋 start-server.bat        # Local server startup script
├── 📖 README.md               # Documentation (Russian)
└── 📖 README_EN.md            # Documentation (English)
```

### Key Files
- **index.html** (2000+ lines): Complete application structure with forms and tables
- **script.js** (2700+ lines): Mathematical calculations, visualization, data management
- **styles.css** (1500+ lines): Responsive styles, dark theme, animations

## 🔬 Scientific Methodology

### Theoretical Foundation
- **Balanced Scorecard (BSC)**: 4 evaluation perspectives (financial, customer, process, learning)
- **Multi-Criteria Decision Analysis (MCDA)**: Structured approach to alternative selection
- **Expert evaluation**: Method for obtaining quantitative assessments from qualified specialists

### Mathematical Framework
```
Weighted integral score:
I = Σ(wi × xi), where wi — criterion weight, xi — score

Kendall's concordance coefficient:
W = 12S / [n²(m³-m)], where S — sum of squared deviations

Significance test χ²:
χ² = n(m-1)W at α = 0.05
```

### Criteria System
- **Financial perspective** (35%): Revenue, costs, payback, new sources
- **Customer perspective** (30%): Loyalty, service time, satisfaction
- **Process perspective** (20%): Automation, flexibility, data quality
- **Learning perspective** (15%): Competencies, technologies, innovation

## 👩‍🎓 Author & Academic Context

**Kurenkova Ekaterina Olegovna**  
🎓 Master's Thesis Research  
🏛️ NUST MISiS — National University of Science and Technology

### Academic Contribution
This application was developed as part of master's thesis research on strategic scenario evaluation for airport non-aviation services development. The work combines theoretical foundations of multi-criteria decision analysis with practical implementation in web technologies.

## 🤝 Contributing

Suggestions and improvements are welcome! Please feel free to:
- Create Issues for bug reports or feature requests
- Submit Pull Requests with improvements
- Share feedback on methodology or implementation

## 📄 License

MIT License - use freely for educational and commercial purposes.

---

✈️ *Research conducted within the framework of strategic scenarios study for non-aviation services development at Sheremetyevo International Airport.*

[Русская версия](README.md)
