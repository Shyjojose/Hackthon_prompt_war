# Civic Navigator: Real-time Polling Intelligence

## 🗳️ Vertical: Civic Engagement & Election Management
Civic Navigator is a smart, context-aware assistant designed to eliminate information asymmetry at polling booths. It addresses critical issues like precinct confusion, technical delays, and communication gaps that lead to voter disenfranchisement.

## 🌟 Key Features
- **Real-time Booth Pulse:** Live status updates (Open/Busy/Incident) and queue wait-time estimation.
- **Precinct Guard:** Automatic verification of the user's current location against their assigned precinct to prevent "wrong location" turn-aways.
- **Smart AI Assistant:** Powered by **Gemini 2.5 Flash**, providing calm, multilingual advice and de-escalation tips.
- **Instant Demo Mode:** Fully functional testing environment using local state if API keys are missing.
- **Visual Mapping:** Interactive Google Maps integration showing nearby stations and current user position.
- **Incident Reporting:** Crowdsourced reporting for machine malfunctions or crowd issues, creating a transparent feedback loop.
- **Inclusivity:** Built-in support for multiple languages (English, Spanish, Hindi, Tamil, French) and accessibility-first UI.

## 🛠️ Tech Stack & Google Services
- **Gemini API:** Contextual reasoning and multilingual voter guidance.
- **Google Maps Platform:** Geocoding, markers, and real-time user tracking.
- **Firebase (Firestore):** Real-time synchronization of booth states and incident reports.
- **React + Vite + TypeScript:** Lightweight, maintainable, and fast frontend (< 10MB repo).

## 🚀 How to Test
1. **Clone & Install:**
   ```bash
   npm install
   ```
2. **Environment Setup:**
   Create a `.env` file based on `.env.example` with your Google Cloud and Firebase keys.
3. **Run Development Server:**
   ```bash
   npm run dev
   ```
4. **Run Automated Tests:**
   ```bash
   npm test
   ```
   Use `npm run test:watch` while developing if you want Vitest to rerun on file changes.
5. **Build Verification:**
   ```bash
   npm run build
   ```
   This confirms the production bundle still compiles cleanly after changes.
6. **Seed Mock Data:**
   Click the **"Seed Mock Data"** button in the app header. This will populate your Firestore with sample booths (Dallas, West Bengal, Tamil Nadu, UK) to simulate real-world incidents.
7. **Interactive Testing:**
   - Change your **Language** in the dropdown and select a booth to see Gemini's localized advice.
   - Click **"Report Issue"** on a booth to test the incident reporting flow.
   - Observe the **Map** markers updating based on the seeded data.

## 🧪 Test Coverage
The current Vitest suite covers the most important user-facing flows:
- **Dashboard Flow:** Rendering, station selection, geolocation consent prompts, and demo mode initialization.
- **BoothCard Interactions:** Card rendering, click behavior, and incident report modal opening.
- **Demo-mode Seeding:** Local storage population with sample polling stations (Dallas, India regions, UK).
- **Model Availability:** Fallback model list verification in `checkAvailableModels` utility.

**Test Execution:**
```bash
npm test                # Run all tests once
npm run test:watch     # Watch mode (rerun on file changes)
```
✅ **Status:** All 5 tests passing | Build: Zero TypeScript errors | Bundle size: ~584 KB (gzipped: ~180 KB)

## 🔒 Security & Quality Improvements
Recent enhancements to strengthen reliability and security:

### Security Hardening
- **Security Headers (firebase.json):** Added X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection headers to prevent MIME sniffing, clickjacking, and XSS attacks.
- **Input Validation:** 500-character limit on incident descriptions with client-side trimming and validation.
- **DOM Safety:** Replaced innerHTML with safe DOM API methods in BoothMap to prevent XSS injection.
- **Environment Variables:** No hardcoded secrets in source code; fails gracefully in demo mode if API keys are missing.

### Error Handling & Logging
- **Error Boundary Component:** Catches React errors and displays user-friendly error UI instead of blank crashes.
- **Logger Service:** Centralized logging with error, warn, info, and debug levels. All user-facing errors logged with context for production debugging.
- **Structured Error Context:** Error messages now include metadata (timestamps, component context) for better troubleshooting.

### Privacy & Consent
- **Geolocation Consent Flow:** Explicit opt-in UI before requesting location permissions. Consent preference saved to localStorage.
- **Battery Optimization:** Reduced geolocation accuracy and optimized watchPosition timeouts to minimize battery drain.
- **User Control:** "Skip" button allows users to proceed without sharing location while still accessing booth information.

### Code Quality
- **Type Safety:** Replaced `any` types with specific TypeScript interfaces. Firebase Timestamp properly typed as `number | { seconds: number; nanoseconds: number }`.
- **Accessibility:** Added ARIA labels and descriptive text for character counters and form controls.
- **Test Compatibility:** All 5 tests updated with proper mock data structures. Build verification confirms zero regressions.

## 🧠 Logic & Decision Making
The assistant uses a "Situational Context Wrapper" to feed Gemini data including:
- User's GPS coordinates vs. Station coordinates.
- Official booth notes (e.g., "Machine maintenance in progress").
- Current time vs. Closing time (10 PM logic).
Gemini then generates advice focused on **de-escalation**, ensuring voters stay informed and calm during delays or rule changes.

## 🌐 Deployment
**Live Production:** https://election-education-495023.web.app  
**GitHub Repository:** https://github.com/Shyjojose/Hackthon_prompt_war  
**CI/CD Pipeline:** GitHub Actions automatically builds and deploys to Firebase Hosting on every push to main branch.

---
*Developed for the Hackathon - Focused on Code Quality, Security, and Meaningful Google Integration.*
