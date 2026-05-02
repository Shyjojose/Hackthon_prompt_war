# Project Guidelines: Hackathon Smart Assistant

## 🚨 Important Rules
- **Repository Size:** The total repository size **must be less than 10 MB**. 
    - *Action:* Use `.gitignore` aggressively (node_modules, large assets, etc.).
    - *Action:* Optimize any local assets or use CDN links where possible.

## 🎯 Challenge Expectation
- **Smart Dynamic Assistant:** Must demonstrate logical decision-making based on user context.
- **Google Services Integration:** Effective and meaningful use of Google APIs/Services.
- **Real-World Usability:** Focus on a practical, vertical-specific solution (e.g., healthcare, finance, education).
- **Clean Code:** Maintainable, well-structured, and idiomatic implementation.
- **Documentation:** A comprehensive `README.md` explaining:
    - Chosen Vertical
    - Approach & Logic
    - Solution Architecture/Workflow

## 🔍 Evaluation Focus Areas
- **Code Quality:** Structure, readability, and maintainability.
- **Security:** Safe and responsible handling of data and credentials.
- **Efficiency:** Optimal use of computational and network resources.
- **Testing:** Validation of core functionality through automated tests.
- **Accessibility:** Inclusive design ensuring the assistant is usable by everyone.
- **Google Services:** Depth and relevance of the integrated Google ecosystem.

---

## 🛠 Development Principles (Agent Mandates)
1. **Lightweight First:** Always check if a library is necessary to keep the repo size down.
2. **Context-Aware Logic:** Prioritize patterns that allow the assistant to "remember" and act on user context.
3. **Security First:** Never commit `.env` or secrets. Use explicit type safety.
4. **Test-Driven:** Every feature must have a corresponding validation step.
