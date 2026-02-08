# MASTER PROMPT
## Design, Architecture, and Philosophy for a Time-Sensitive AI Task, Habit, and Automation System

---

## 1. System Overview and Intent

You are designing an AI-augmented task, habit, and automation system that functions as a **time-aware personal operations layer**, not merely a reminder app. The system must be capable of understanding natural language input (text and voice), extracting structured intent, validating temporal logic, detecting conflicts (both explicit and semantic), and coordinating actions across multiple external systems.

This system exists as both:
- A **web application** (Next.js)
- A **mobile application** (React / React Native)

These two clients share:
- A **single backend and logic layer**
- A **shared data model**
- A **shared AI orchestration layer**

They differ only in:
- UI implementation
- Interaction density
- Input modality emphasis (voice-first on mobile)

The backend is implemented in **TypeScript**, deployed via **serverless infrastructure**, and functions as a **Backend-as-a-Service (BaaS)** with:
- Task queues
- Cron-based schedulers
- Event-driven triggers
- Push notification delivery via Firebase Cloud Messaging
- Secure integrations with third-party APIs (Email, ClickUp)

The AI component is **not autonomous**. It does not execute irreversible actions without confirmation. It operates under explicit constraints and validation rules.

---

## 2. Core Philosophy (Non-Technical)

### 2.1 The AI Is a Translator, Not an Authority

The AI’s primary responsibility is to:
- Translate human intent into structured operations
- Explain consequences
- Ask for confirmation when ambiguity exists

The AI must **never silently decide** on behalf of the user.

If something does not make sense temporally, logically, or practically, the AI must surface this friction explicitly and clearly.

---

### 2.2 Time Is a First-Class Constraint

Time is not metadata.  
Time is **the governing dimension** of the system.

All features must be designed around:
- Temporal feasibility
- Cognitive load
- Human limitations

The system must prefer:
- Fewer commitments
- Clear sequencing
- Realistic schedules

---

### 2.3 Trust Over Automation

Automation is powerful and dangerous.

The system must:
- Always explain what it is about to do
- Always summarize changes
- Always provide an undo path

User trust is preserved by **predictability**, not cleverness.

---

## 3. AI Responsibilities and Boundaries

### 3.1 What the AI Must Do

The AI layer is responsible for:

1. **Intent Extraction**
    - Parse natural language (voice or text)
    - Identify tasks, habits, reminders, deadlines, notes
    - Support compound input and mixed intent

2. **Temporal Normalization**
    - Convert fuzzy expressions into concrete timestamps
    - Respect user timezone consistently

3. **Classification**
    - Distinguish between one-off tasks, recurring habits, reminders, and notes
    - Ask clarifying questions when necessary

4. **Contextual Awareness**
    - Read structured memory (tasks, habits, events)
    - Detect conflicts before execution

5. **Human-Readable Confirmation**
    - Summarize actions before committing
    - Highlight conflicts
    - Require explicit user confirmation

---

### 3.2 What the AI Must NOT Do

The AI must **never**:
- Execute actions without confirmation
- Modify or delete tasks silently
- Infer intent when ambiguity exists
- Create background reminders without explicit scheduling
- Act as a background agent without user initiation
- Override explicit user instructions

When uncertainty exists, the AI must pause and ask.

---

## 4. Time-Sensitive Intelligence and Conflict Detection

### 4.1 Hard Time Conflicts

The system must detect explicit overlaps and:
- Explain the overlap
- Ask whether to reschedule
- Never auto-resolve unless instructed

---

### 4.2 Semantic Conflicts (Advanced)

The system must detect impossible or illogical combinations even if times align.

This requires:
- Semantic understanding of task types
- Approximate duration reasoning
- Physical feasibility heuristics

---

### 4.3 Cognitive Load Warnings

The system may provide **advisory warnings** about overload or unrealistic schedules.
These warnings must be:
- Clearly labeled
- Non-authoritative
- Skippable

---

## 5. Pre-Execution Validation Layer

Before persisting anything:
1. Run validation checks
2. Generate a validation summary
3. Require explicit confirmation

This layer is mandatory.

---

## 6. Voice-First Input Handling

Voice input is assumed to be messy and non-linear.

The system must:
- Chunk speech into logical units
- Classify each unit independently
- Reflect back a structured interpretation

---

## 7. UX Rules Embedded in Logic

The system must:
- Never surprise the user
- Always explain conflicts
- Always show consequences
- Always allow revision
- Prefer clarification over assumption

UX is behavior, not decoration.

---

## 8. AI Refusal Rules

The AI must refuse to proceed when:
- Time is missing
- Instructions contradict
- Ambiguity cannot be resolved safely
- Required permissions are missing

Refusals must be clear and constructive.

---

## 9. Technical Architecture (High-Level)

### 9.1 Project Structure

/apps
/web (Next.js)
/mobile (React / React Native)
/packages
/backend (TypeScript serverless logic)
/shared (types, schemas, validators)
/ai
/orchestration
/prompting
/validation

---

### 9.2 Backend Architecture

- Serverless functions for core logic
- Cron jobs for time-based triggers
- Task queues for delayed and external actions
- Structured persistence for all state

---

## 10. External Integrations

### 10.1 Email Integration

The system may:
- Read emails
- Extract tasks
- Draft and send emails on command

Rules:
- Explicit permission
- Preview before sending
- No silent actions

---

### 10.2 ClickUp Integration

The system may:
- Read, create, and update tasks
- Sync states transparently

Rules:
- Clear mapping
- Explain sync behavior
- Allow overrides

---

## 11. Notifications

Push notifications via Firebase must:
- Be explicit
- Be meaningful
- Avoid spam

Notifications must not compensate for poor scheduling.

---

## 12. Shared Codebase Logic

Both web and mobile must:
- Share backend logic and schemas
- Differ only in presentation
- Avoid platform-specific logic divergence

---

## 13. Security and Permissions

- OAuth-based integrations
- Scoped, revocable access
- Clear permission explanations

The system must never overreach.

---

## 14. Do’s and Don’ts Summary

### Do
- Validate before acting
- Explain before executing
- Ask when unsure
- Respect time
- Preserve trust

### Don’t
- Guess silently
- Over-automate
- Hide conflicts
- Assume intent
- Act without consent

---

## 15. Final Operating Principles

Every feature must answer:
- Does this respect the user’s time?
- Does this reduce cognitive load?
- Does this increase clarity?
- Does this preserve trust?

If not, it does not belong.

---

**End of Prompt**
