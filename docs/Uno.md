This document outlines the design and implementation plan for a **personal voice-first planning assistant**. The system is engineered to transform casual voice input into structured, actionable items (tasks, reminders, habits) while maintaining long-term context and memory. The architecture is built on a modern, scalable stack: **Next.js** (Frontend), **Tailwind CSS** (Styling), **LangChain/TypeScript** (AI Agents), and **Supabase** (Backend/Database).

The core design principle is to create a **fast, calm, and low-friction** user experience, minimizing manual sorting and maximizing clarity by highlighting the system's assumptions and inferences.

## 1. System Architecture and Technology Stack

The system employs a modular, three-tier architecture: Presentation, Orchestration, and Persistence.

### 1.1. Technology Stack Overview

| Layer | Technology | Purpose | Key Features Utilized |
| :--- | :--- | :--- | :--- |
| **Presentation** | Next.js (App Router) | Responsive, low-friction UI | Server Components, API Routes, Tailwind CSS |
| **Orchestration** | LangChain (TypeScript) | Agent logic, tool calling, and memory management | Structured Output Parsers, Custom Tools, RAG |
| **Persistence** | Supabase | Data persistence, authentication, and file storage | PostgreSQL, Auth, Storage, Edge Functions, `pgvector` |
| **Voice Processing** | OpenAI Whisper | Speech-to-text transcription | High-accuracy, low-latency transcription |
| **Integrations** | ClickUp API, Gmail API | External task syncing and email scanning | Secure API calls via Supabase Edge Functions |

### 1.2. Core Data Flow (Voice Input to Actionable Output)

1.  **Capture**: User records voice via the Next.js frontend (MediaRecorder API).
2.  **Upload**: Audio file is uploaded to **Supabase Storage**.
3.  **Transcription**: Next.js calls a secure **Supabase Edge Function** (`transcribe-audio`), which uses the OpenAI Whisper API to convert the audio to text.
4.  **Orchestration**: The transcription and user context are passed to the **LangChain Orchestration Agent** (via another Edge Function, `process-transcription`).
5.  **Action**: The Agent retrieves relevant memories from the Supabase Vector DB, reasons over the input, and executes tools to create structured data in the Supabase database.
6.  **Review**: The structured output is returned to the Next.js frontend for the user to review and confirm.

## 2. Frontend Implementation Plan (Next.js & Tailwind CSS)

The frontend is designed around a minimalist, high-contrast aesthetic to meet the UX expectation of being "space-free" and low-friction.

### 2.1. Core Pages and Routes

| Route | Page Name | Purpose | Requirement Addressed |
| :--- | :--- | :--- | :--- |
| `/` | Dashboard | Overview of today's tasks, habits, and recent activity. | General UX |
| `/capture` | Voice Capture | Primary interface for voice recording and processing. | 1, 6 |
| `/tasks` | Task List | Detailed view and management of all Tasks, Reminders, and Habits. | 1 |
| `/memory` | Memory & Context | Transparency and control over the assistant's long-term memory. | 5 |
| `/entities` | Entities | Management of People, Organizations, and Projects. | 4 |
| `/settings` | Settings | Configuration for integrations and notifications. | 7, 8, 9 |

### 2.2. Key UX Features

*   **Voice Capture Component**: Features a clear mode selector for **Direct**, **Conversation**, and **Extended Capture** modes (Requirement 6).
*   **Output Review Component**: A critical component that displays extracted items. It will visually highlight any details that were **inferred** by the AI (e.g., a default due time) and allow for quick, one-click correction or confirmation (Requirement 2, 10).
*   **Memory Management**: The `/memory` page will include an **Interpretation Log** showing which memory items were used to interpret the last few voice messages, providing transparency into the AI's reasoning (Requirement 5).

## 3. Agent Architecture and LangChain Strategy

The system relies on a single, intelligent **Orchestration Agent** written in TypeScript, leveraging LangChain's capabilities for complex reasoning and tool use.

### 3.1. LangChain Tools (Agent Capabilities)

The agent's functionality is defined by the following custom tools, which interface with the Supabase backend:

| Tool Name | Purpose | Input/Output | Requirement Addressed |
| :--- | :--- | :--- | :--- |
| `createStructuredItems` | Extracts and structures tasks, habits, and reminders from text. | Structured JSON output with inference tracking. | 1, 2 |
| `retrieveMemory` | Fetches relevant long-term memories and entities for context (RAG). | Queries Supabase Vector DB. | 3, 4 |
| `updateEntity` | Creates or updates a Person, Organization, or Project entity. | Updates the `entities` table. | 4 |
| `syncToClickUp` | Duplicates a created task to the user's ClickUp account. | Calls secure Edge Function for ClickUp API. | 9 |
| `scanEmailInbox` | Scans the user's personal inbox for implied tasks. | Calls secure Edge Function for Gmail API. | 8 |

### 3.2. Memory and Context Engine

The system achieves long-term memory (Requirement 3) using **Retrieval-Augmented Generation (RAG)**:

1.  **Storage**: Embeddings of past interactions, explicit memories, and entity notes are stored in the **Supabase Vector DB** (using the `pgvector` extension).
2.  **Retrieval**: Before processing a new voice input, the `retrieveMemory` tool performs a semantic search to inject the most relevant context into the Agent's prompt, ensuring the assistant understands the user's life context and prior preferences.

## 4. Supabase Backend Schema and API Structure

The backend is centered on a PostgreSQL database with strict **Row-Level Security (RLS)** to ensure data is only accessible by the authenticated user (`auth.uid()`).

### 4.1. Key Database Tables

| Table Name | Purpose | Key Columns | RLS Policy |
| :--- | :--- | :--- | :--- |
| `tasks`, `reminders`, `habits` | Core planning items. | `user_id`, `title`, `due_at`/`remind_at`/`schedule` | `auth.uid() = user_id` |
| `entities` | People, Organizations, Projects. | `user_id`, `type`, `name` | `auth.uid() = user_id` |
| `memories` | Explicit memory items and context. | `user_id`, `content`, `weight` | `auth.uid() = user_id` |
| `vectors` | Vector embeddings for RAG. | `user_id`, `embedding`, `source_id` | `auth.uid() = user_id` |

### 4.2. Supabase Edge Functions

Edge Functions provide a secure, serverless environment for executing sensitive logic:

*   `transcribe-audio`: Handles the secure call to the OpenAI Whisper API.
*   `process-transcription`: Hosts the **LangChain Orchestration Agent** logic.
*   `sync-clickup`: Manages the secure API integration with ClickUp.
*   `scan-email`: Manages the secure API integration with Gmail for task extraction.

### 4.3. Next.js API Routes

Next.js API routes serve as the secure gateway to the Edge Functions and database, handling authentication and data validation before passing requests to the backend services. The primary route will be `/api/v1/capture`, which orchestrates the entire voice-to-task pipeline.

## 5. Implementation Steps Summary

1.  **Setup**: Initialize Next.js/Tailwind project and configure Supabase client.
2.  **Authentication**: Implement Supabase Auth and RLS policies on all tables.
3.  **Backend Core**: Define the PostgreSQL schema and enable the `pgvector` extension.
4.  **Edge Functions**: Implement the core Edge Functions (`transcribe-audio`, `process-transcription`).
5.  **Agent Development**: Develop the LangChain Orchestration Agent and its core tools (`createStructuredItems`, `retrieveMemory`).
6.  **Frontend UI**: Build the core pages (`/`, `/capture`, `/tasks`) with the specified UX features (e.g., Inference Highlight).
7.  **Integrations**: Implement the `sync-clickup` and `scan-email` tools and their corresponding Edge Functions/API routes.
8.  **Testing**: Thoroughly test the end-to-end voice-to-action pipeline and memory retrieval accuracy.
