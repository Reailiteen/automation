# Frontend Implementation Plan: Next.js & Tailwind CSS

## 1. Technology Stack & Configuration
*   **Framework**: Next.js (App Router) for server-side rendering (SSR) and API routes.
*   **Styling**: Tailwind CSS for utility-first styling, ensuring a fast, calm, and low-friction UI (Requirement 10).
*   **State Management**: React Context or Zustand for global state (e.g., user session, memory context).
*   **Data Fetching**: Supabase Client (via Next.js Server Components/Actions) for secure data access.

## 2. Core Pages and Routes
| Route | Page Name | Purpose |
| :--- | :--- | :--- |
| `/` | Dashboard | Overview of today's tasks, habits, and recent activity. |
| `/capture` | Voice Capture | Primary interface for voice recording and processing. |
| `/tasks` | Task List | Detailed view and management of all Tasks, Reminders, and Habits. |
| `/memory` | Memory & Context | Transparency and control over the assistant's long-term memory (Requirement 5). |
| `/entities` | Entities | Management of People, Organizations, and Projects (Requirement 4). |
| `/settings` | Settings | Configuration for integrations (ClickUp, Email), notifications, and user preferences. |

## 3. Key Components & UX (Tailwind CSS Focus)
The design philosophy will be **minimalist and high-contrast** to support the "fast, calm, and low-friction" UX expectation.

### A. Voice Capture Component (`/capture`)
*   **Design**: Large, central microphone button with clear state indicators (Recording, Processing, Ready).
*   **Functionality**: Utilizes the browser's `MediaRecorder` API.
*   **Mode Selector**: A clear toggle/dropdown for the three listening modes: **Direct**, **Conversation**, and **Extended Capture** (Requirement 6).

### B. Output Review Component
*   **Design**: A modal or slide-over panel that appears after processing.
*   **Content**: Displays the extracted items (Task, Reminder, Habit) with clear labels (Requirement 1).
*   **Inference Highlight**: Visually highlights details that were **inferred** (e.g., a light yellow background on a due date) and provides a one-click edit/confirmation (Requirement 2, 10).

### C. Memory Management Component (`/memory`)
*   **Design**: Tabbed interface: **Memory Items**, **Entity Graph**, **Interpretation Log**.
*   **Memory Items**: List of stored memories with a "weight" or "priority" slider for quick adjustment (Requirement 5).
*   **Interpretation Log**: Shows the last 5 voice inputs and which memory items were retrieved and used for context (Requirement 5).

### D. Notification Handling
*   **Implementation**: Use Next.js API routes to handle incoming webhooks from the notification service (e.g., Supabase Edge Functions or a dedicated service).
*   **User Interface**: A settings panel to manage notification preferences (time, device, early nudges) (Requirement 7).

## 4. Implementation Steps
1.  **Project Setup**: Initialize Next.js project with Tailwind CSS and Supabase client.
2.  **Authentication**: Implement Supabase Auth for user login/signup.
3.  **Core UI**: Build the Dashboard and Navigation structure.
4.  **Capture UI**: Implement the Voice Capture component and audio upload logic.
5.  **Data Display**: Build the Task List and Entity management components, connecting them to mock data first.
6.  **Integration**: Connect components to the Supabase and Agent APIs as they are developed.
