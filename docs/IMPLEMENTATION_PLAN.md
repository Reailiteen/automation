# Complete UI Implementation Plan - Mockup-Based Design

## Overview
Transform the application UI to match the provided mockups with dark theme, circular progress indicators, energy gauges, schedule views, enhanced chat interface, and detailed task views.

## Package Requirements

### Current Packages (Verified)
- ✅ Next.js 16.1.1
- ✅ React 19.2.3  
- ✅ Tailwind CSS 4 (configured via PostCSS)
- ✅ Framer Motion 12.25.0
- ✅ Lucide React 0.562.0
- ✅ Groq SDK 0.37.0

### Additional Packages Needed
1. **recharts** - For circular progress indicators and energy gauge visualization
2. **date-fns** - For date/time formatting in schedule views
3. **clsx** - Already installed ✅
4. **tailwind-merge** - Already installed ✅

## Mockup Analysis & Component Requirements

### Mockup 1: Dashboard
**Components Needed:**
- Welcome section with "Welcome back" heading
- "No active task" card with:
  - Star icon (Sparkles from lucide-react)
  - Large white text
  - Gradient button (blue to teal/cyan)
- "Today's Schedule" horizontal bar component
- "Active Plans" section (links to plans page)

**Design Specs:**
- Dark background
- White/light text
- Gradient buttons (blue → teal)
- Card-based layout

### Mockup 2: Plan Creation Modal
**Components Needed:**
- Modal overlay with backdrop blur
- Form inputs (Plan Title, Description)
- Voice Input component (already exists, needs styling update)
- Glowing microphone icon with blue-cyan outline
- Cancel and Create Plan buttons

**Design Specs:**
- Light modal on dark background
- Glowing microphone effect
- Clean form inputs

### Mockup 3: Active Plans View
**Components Needed:**
- CircularProgress component (65%, 78%, 45%)
- PlanCard component with:
  - Circular progress indicator
  - Plan name and icon
  - Energy level badge (High/Medium/Low)
  - Priority badge (High/Medium/Low)
  - Task count
  - Gradient progress fills (teal-purple-pink)

**Design Specs:**
- Three cards horizontally
- Large circular progress (center of card)
- Gradient fills for progress
- Energy/Priority indicators
- Active state highlighting

### Mockup 4: Schedule View
**Components Needed:**
- ScheduleTimeBlock component for each time slot
- EnergyGauge component (circular gauge with needle)
- Time formatting utilities
- Priority tag components
- Focus level indicators

**Design Specs:**
- Left: Time-blocked list
- Right: Energy gauge
- Color-coded priority tags
- Gradient backgrounds for tasks

### Mockup 5: Chat Interface
**Components Needed:**
- ChatSidebar component with:
  - Chat history list
  - Active chat highlighting
  - Navigation items (Tasks, Settings)
  - "+ Message Manus" button
- Updated chat bubbles (glassy effect)
- Enhanced input area with glowing mic

**Design Specs:**
- Sidebar on left
- Main chat on right
- Glassy/translucent message bubbles
- Glowing microphone icon

### Mockup 6: Task Detail View
**Components Needed:**
- TaskDetailLayout component
- CircularProgress component (75%)
- Subtask list with checkboxes
- Dependencies section
- Tags section with pills
- AI Insights sidebar
- Action buttons (Edit, Complete, Archive)
- Time tracking progress bar

**Design Specs:**
- Main content on left
- Sidebar on right with progress and insights
- Detailed task information
- Progress indicators

## Implementation Phases

### Phase 1: Setup & Foundation
1. Install recharts and date-fns packages
2. Verify Tailwind CSS v4 is working
3. Update global styles for dark theme matching mockups
4. Create design token system

### Phase 2: Core UI Components
1. CircularProgress component (SVG-based with gradients)
2. EnergyGauge component (circular gauge with color spectrum)
3. ScheduleTimeBlock component
4. PlanCard component
5. ChatSidebar component
6. TaskDetailLayout component

### Phase 3: Page Redesigns
1. Dashboard page (mockup 1)
2. Plan creation modal (mockup 2)
3. Active Plans page (mockup 3)
4. Schedule page (mockup 4)
5. Chat page update (mockup 5)
6. Task detail page (mockup 6)

### Phase 4: Integration & Polish
1. Connect components to existing data/APIs
2. Add animations and transitions
3. Ensure responsive design
4. Test all interactions
5. Final visual polish

## Component Specifications

### CircularProgress Component
```typescript
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  gradient?: 'blue-purple' | 'teal-purple' | 'blue-teal';
  showPercentage?: boolean;
  children?: React.ReactNode;
}
```
- SVG-based circular progress
- Gradient stroke (conic gradient)
- Percentage text in center
- Customizable size and colors

### EnergyGauge Component
```typescript
interface EnergyGaugeProps {
  level: 'low' | 'medium' | 'high';
  size?: number;
}
```
- Circular gauge with needle
- Color spectrum (red → orange → green)
- Current level indicator
- Level labels

### ScheduleTimeBlock Component
```typescript
interface ScheduleTimeBlockProps {
  startTime: Date;
  endTime: Date;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  focusLevel: 'shallow' | 'medium' | 'deep';
  type?: 'work' | 'break' | 'free';
}
```
- Time display
- Task information
- Priority tag
- Focus indicator
- Gradient background

### PlanCard Component
```typescript
interface PlanCardProps {
  plan: Plan;
  progress: number;
  energyLevel: 'low' | 'medium' | 'high';
  priority?: 'low' | 'medium' | 'high';
  taskCount: number;
  isActive?: boolean;
}
```
- Circular progress indicator
- Plan metadata
- Energy/Priority badges
- Task count
- Active state styling

## Color Palette (Dark Theme)
- Background: `#0a0a0a` or `hsl(220, 13%, 9%)`
- Card Background: `#1a1a1a` or `hsl(220, 13%, 11%)`
- Text Primary: `#ffffff`
- Text Secondary: `#a0a0a0`
- Primary Gradient: `#3b82f6` → `#8b5cf6` (blue to purple)
- Accent Gradient: `#06b6d4` → `#14b8a6` (cyan to teal)
- Progress Gradients: Various (blue-purple-teal combinations)
- Priority High: `#ef4444` (red)
- Priority Medium: `#f97316` (orange)
- Priority Low: `#6b7280` (gray)

## File Structure
```
src/
  components/
    ui/
      circular-progress.tsx (new)
      energy-gauge.tsx (new)
      schedule-time-block.tsx (new)
      plan-card.tsx (new)
      chat-sidebar.tsx (new)
      task-detail-layout.tsx (new)
    plans/
      plan-card.tsx (new)
      plans-page.tsx (new)
    schedule/
      schedule-page.tsx (new)
      time-block.tsx (new)
    tasks/
      task-detail-page.tsx (new)
  app/
    page.tsx (update)
    plans/
      page.tsx (new)
    schedule/
      page.tsx (new)
    tasks/
      [id]/
        page.tsx (new)
    chat/
      page.tsx (update)
```

## Technical Implementation Notes

### Tailwind CSS v4
- Uses CSS-based configuration (no JS config file needed)
- Configured via `@tailwindcss/postcss` plugin
- Custom utilities can be added in `@layer utilities`

### Circular Progress
- Use SVG with `stroke-dasharray` and `stroke-dashoffset`
- Apply conic gradient for fill
- Animate with Framer Motion

### Energy Gauge
- SVG-based circular gauge
- Needle rotation based on level
- Color stops for spectrum

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack components vertically on mobile

## Success Criteria
- ✅ All mockup designs implemented
- ✅ Dark theme consistent throughout
- ✅ Circular progress indicators working
- ✅ Energy gauge functional
- ✅ Schedule view with time blocks
- ✅ Chat interface with sidebar
- ✅ Task detail page complete
- ✅ All components responsive
- ✅ Animations smooth
- ✅ Tailwind CSS properly applied
