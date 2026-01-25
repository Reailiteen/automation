# System Architecture: Personal Voice-First Planning Assistant

## 1. High-Level Overview
The system is designed as a **Next.js** web application with a **Supabase** backend and **LangChain** powered AI agents. It follows a modular architecture to handle voice processing, entity tracking, and long-term memory.

## 2. Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), Tailwind CSS | Responsive, low-friction UI |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) | Data persistence, authentication, and file storage |
| **AI Orchestration** | LangChain (TypeScript) | Agent logic, tool calling, and memory management |
| **Voice Processing** | OpenAI Whisper (via API) | Speech-to-text transcription |
| **Memory** | Supabase Vector (pgvector) | Semantic search for long-term context |
| **Integrations** | ClickUp API, Gmail API | External task syncing and email scanning |

## 3. Core Components
### A. Voice Processing Pipeline
1. **Capture**: Browser-based audio recording (MediaRecorder API).
2. **Transcription**: Audio uploaded to Supabase Storage -> Trigger Edge Function -> OpenAI Whisper.
3. **Extraction Agent**: LangChain agent parses text into structured JSON (Tasks, Habits, Reminders).

### B. Memory & Context Engine
1. **Short-term**: Session-based context in LangChain.
2. **Long-term**: Vector embeddings of past interactions stored in Supabase.
3. **Entity Store**: Relational tables for People, Organizations, and Projects.

### C. Notification System
1. **Web Push**: For Mac/Browser notifications.
2. **Mobile**: Integration with a service like OneSignal or Firebase for iOS.

## 4. Data Flow
1. User speaks -> Audio recorded -> Transcribed.
2. Transcription + Context (from Vector DB) -> LangChain Agent.
3. Agent identifies intent -> Calls Tools (Create Task, Update Habit, etc.).
4. UI updates in real-time via Supabase Realtime subscriptions.
