# UI Implementation Plan - Based on Mockups

## Overview
Implement the complete UI design matching the provided mockups with dark theme, circular progress indicators, energy gauges, schedule views, chat interface, and task detail pages.

## Required Packages Analysis

### Already Installed
- ✅ Next.js 16.1.1
- ✅ React 19.2.3
- ✅ Tailwind CSS 4
- ✅ Framer Motion 12.25.0
- ✅ Lucide React 0.562.0
- ✅ Groq SDK 0.37.0

### Additional Packages Needed
1. **recharts** - For circular progress indicators and energy gauge
2. **date-fns** - For date/time formatting in schedule
3. **react-circular-progressbar** (optional, or use recharts) - Circular progress
4. **@radix-ui/react-progress** (optional) - Progress components

## Mockup Analysis

### 1. Dashboard (Main Page)
**Features:**
- Dark theme background
- "Welcome back" heading
- "No active task" card with:
  - Star icon
  - Large white text
  - "Create Your First Plan" gradient button (blue to teal)
- "Today's Schedule" section:
  - Horizontal bar with "Total tasks: 0" and "Time allocated: 0m"
  - "View Detailed Schedule >" link
- "Active Plans" section:
  - Plan cards with circular progress (65%, 78%, 45%)
  - Energy level indicators
  - Task counts
  - Plan names with icons

### 2. Plan Creation Modal
**Features:**
- Modal overlay with blurred background
- "Create Your First Plan" title
- Plan Title input field
- Description textarea
- Voice Input section:
  - Large circular microphone icon
  - Glowing blue-cyan outline
  - "Click to record or speak your task" text
- Cancel and Create Plan buttons

### 3. Active Plans View
**Features:**
- Three plan cards horizontally:
  - "Fitness Goals" - 65% progress, High energy, 3 tasks
  - "Work Projects" - 78% progress, High priority, 5 tasks (highlighted)
  - "Learning" - 45% progress, 2 tasks
- Circular progress indicators with gradient fills
- Energy/Priority badges
- Task count indicators

### 4. Schedule View
**Features:**
- Left side: Time-blocked schedule
  - "Today's Schedule" title with calendar icon
  - Time blocks with:
    - Start time
    - Task title
    - Duration
    - Priority tags (High/Urgent/Medium/Low)
    - Focus level (Intense/Moderate/High/Mindful)
  - Break times (gray)
  - Free time slots
- Right side: Energy Level gauge
  - Circular gauge with needle
  - Color spectrum (LOW/MEDIUM/HIGH)
  - Current level indicator
  - Bullet points for levels

### 5. Chat Interface
**Features:**
- Left sidebar: Chat History
  - List of previous chats
  - Active chat highlighted
  - "Tasks" and "Settings" menu items
  - "+ Message Manus" button at bottom
- Main area: Chat window
  - "AI Assistant" title with green status dot
  - Message bubbles (left: AI, right: user)
  - Glassy/translucent effect
  - Input field: "Type or speak..."
  - Glowing microphone icon

### 6. Task Detail View
**Features:**
- Project header with status badge
- Project details:
  - Priority (High) with flame icon
  - Focus Level (Deep Work)
  - Energy Required (Medium)
- Time Tracking:
  - Estimated vs Actual time
  - Progress bar (75%)
- Subtasks list with checkboxes
- Dependencies section
- Tags section with pill buttons
- Action buttons: Edit, Complete, Archive
- Right sidebar:
  - Large circular progress (75%)
  - AI Insights card with bullet points

## Implementation Tasks

### Phase 1: Setup & Configuration
1. Verify Tailwind CSS v4 configuration
2. Install required packages (recharts, date-fns)
3. Update global styles for dark theme
4. Create design tokens for colors, spacing

### Phase 2: Core UI Components
1. Circular Progress Component
2. Energy Gauge Component
3. Schedule Time Block Component
4. Plan Card Component
5. Chat Sidebar Component
6. Task Detail Layout Component

### Phase 3: Page Implementations
1. Redesign Dashboard (main page)
2. Create/Update Plan Creation Modal
3. Create Active Plans Page
4. Create Schedule View Page
5. Update Chat Interface
6. Create Task Detail Page

### Phase 4: Integration & Polish
1. Connect all components to data
2. Add animations and transitions
3. Ensure responsive design
4. Test all interactions
5. Polish visual details

## Component Specifications

### CircularProgress Component
- SVG-based circular progress
- Gradient fills (blue-purple-teal)
- Percentage display in center
- Customizable size and stroke width

### EnergyGauge Component
- Circular gauge with needle
- Color spectrum (red-orange-green)
- Current level indicator
- Level labels (LOW/MEDIUM/HIGH)

### ScheduleTimeBlock Component
- Time display
- Task title
- Duration badge
- Priority tag (colored)
- Focus level indicator
- Gradient background based on priority

### PlanCard Component
- Circular progress indicator
- Plan name with icon
- Energy/Priority badge
- Task count
- Hover effects
- Active state highlighting

### ChatSidebar Component
- Chat history list
- Active chat highlighting
- Navigation items
- Message button at bottom

## Color Palette (Dark Theme)
- Background: Dark gray/black
- Cards: Dark gray with transparency
- Primary: Blue-purple gradient
- Accent: Teal-cyan
- Progress: Blue-purple-teal gradients
- Text: White/light gray
- Priority tags: Red (high), Orange (medium), Gray (low)

## Technical Notes
- Use Tailwind CSS v4 utilities
- Leverage Framer Motion for animations
- Use SVG for circular progress (better control)
- Implement proper dark mode
- Ensure accessibility (WCAG AA)
- Mobile responsive design
