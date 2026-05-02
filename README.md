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
4. **Seed Mock Data:**
   Click the **"Seed Mock Data"** button in the app header. This will populate your Firestore with sample booths (Dallas, West Bengal, Tamil Nadu, UK) to simulate real-world incidents.
5. **Interactive Testing:**
   - Change your **Language** in the dropdown and select a booth to see Gemini's localized advice.
   - Click **"Report Issue"** on a booth to test the incident reporting flow.
   - Observe the **Map** markers updating based on the seeded data.

## 🧠 Logic & Decision Making
The assistant uses a "Situational Context Wrapper" to feed Gemini data including:
- User's GPS coordinates vs. Station coordinates.
- Official booth notes (e.g., "Machine maintenance in progress").
- Current time vs. Closing time (10 PM logic).
Gemini then generates advice focused on **de-escalation**, ensuring voters stay informed and calm during delays or rule changes.

---
*Developed for the Hackathon - Focused on Code Quality, Security, and Meaningful Google Integration.*
