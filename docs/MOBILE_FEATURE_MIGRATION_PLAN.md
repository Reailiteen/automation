# Complete Mobile Feature Migration Plan

## Current Status: Mobile app has only 10% of web features

### Web App Features Analysis

**Pages (9 total):**
1. ✅ Dashboard (`/`) - Complex: Welcome, Active Task, Schedule preview, Pressure, AI Insights, Today's Tasks grid
2. ❌ Tasks List (`/tasks`) - Grid view with filters
3. ❌ Task Detail (`/tasks/[id]`) - Full task view with subtasks, dependencies, AI insights
4. ⚠️  Chat (`/chat`) - Basic version exists, needs sidebar and history
5. ⚠️  Plans (`/plans`) - Basic version exists, needs circular progress and plan cards
6. ❌ Schedule (`/schedule`) - Time blocks view with energy gauge
7. ❌ Pressure (`/pressure`) - Workload monitoring
8. ❌ Login (`/auth/login`) - Authentication
9. ❌ Signup (`/auth/signup`) - Registration

**UI Components (18 total):**
1. ❌ CircularProgress - SVG circular progress with gradients
2. ❌ EnergyGauge - Circular gauge with needle
3. ❌ ScheduleTimeBlock - Time slot component
4. ❌ VoiceInput - Voice recording component
5. ❌ ChatSidebar - Chat history and navigation
6. ❌ Button - Styled button component
7. ❌ Card - Container component
8. ❌ TaskCard - Detailed task display
9. ❌ TaskCreationForm - Modal form with voice input
10. ❌ PlanCard - Plan display with progress
11. ❌ DuplicateConfirmationModal - Duplicate detection
12. ❌ Navigation - App navigation bar
13. ❌ Layout - Page wrapper
14. ❌ AuthProvider - Authentication context

**Features (25 total):**
1. ✅ Basic task list (simplified)
2. ✅ Basic chat (simplified)
3. ✅ Basic plans list (simplified)
4. ❌ Welcome dashboard
5. ❌ Active task display
6. ❌ Today's schedule preview
7. ❌ Pressure/workload widget
8. ❌ AI Insights display
9. ❌ Task grid layout
10. ❌ Task detail view
11. ❌ Subtasks management
12. ❌ Dependencies tracking
13. ❌ Tags system
14. ❌ Priority indicators
15. ❌ Focus level badges
16. ❌ Energy requirement indicators
17. ❌ Circular progress displays
18. ❌ Energy gauge
19. ❌ Voice input
20. ❌ Task creation form with modal
21. ❌ Chat history sidebar
22. ❌ Schedule time blocks view
23. ❌ Authentication (login/signup)
24. ❌ Plan cards with progress
25. ❌ Duplicate detection

## Migration Strategy

### Phase 1: Core UI Components (Week 1)
Priority: HIGH - Foundation for all screens

**Components to Create:**
1. `CircularProgress` - React Native SVG version
2. `Card` - Container with proper styling
3. `Button` - Reusable button component
4. `Badge` - For priority, tags, status
5. `TaskCard` - Full-featured task display
6. `PlanCard` - Plan display with circular progress

**Estimated: 8 hours**

### Phase 2: Dashboard (Week 1-2)
Priority: HIGH - Most important page

**Features to Implement:**
1. Welcome section
2. Active Task card
3. "No active task" state with "Talk your mind" button
4. Quick Actions dashboard:
   - Today's Schedule widget
   - Weekly Pressure widget
   - AI Insights widget
5. Today's Tasks grid (2-column on mobile)
6. Task count and time allocation display

**Estimated: 12 hours**

### Phase 3: Enhanced Task Components (Week 2)
Priority: HIGH - Core functionality

**Components to Create:**
1. `TaskCreationForm` - Modal with sections
2. `TaskDetailScreen` - Full task view
3. `SubtaskList` - Subtask management
4. `DependencyList` - Dependencies display
5. `TagsList` - Tags management
6. `PriorityIndicator` - Visual priority display
7. `FocusLevelBadge` - Focus level indicator
8. `EnergyIndicator` - Energy requirement display

**Estimated: 10 hours**

### Phase 4: Schedule & Energy (Week 2-3)
Priority: MEDIUM - Important visualization

**Components to Create:**
1. `EnergyGauge` - React Native SVG circular gauge
2. `ScheduleTimeBlock` - Time slot component
3. `ScheduleScreen` - Full schedule view
4. Date picker for schedule
5. Time range display
6. Energy level integration

**Estimated: 8 hours**

### Phase 5: Voice Input (Week 3)
Priority: HIGH - Core feature

**Components to Create:**
1. `VoiceInput` - Using Expo Audio
2. Record button with animation
3. Audio waveform visualization
4. Voice-to-text integration
5. Integration in TaskCreationForm
6. Integration in ChatScreen

**Estimated: 10 hours**

### Phase 6: Enhanced Chat (Week 3)
Priority: MEDIUM

**Features to Implement:**
1. Chat history sidebar (collapsible)
2. Multiple chat sessions
3. Agent routing display
4. Message formatting
5. Typing indicators
6. Chat persistence

**Estimated: 6 hours**

### Phase 7: Plans Enhancement (Week 4)
Priority: MEDIUM

**Features to Implement:**
1. Circular progress for each plan
2. Plan cards with energy/priority
3. Task count display
4. Progress calculation
5. Plan creation modal
6. Plan detail view

**Estimated: 6 hours**

### Phase 8: Pressure/Workload (Week 4)
Priority: LOW - Nice to have

**Features to Implement:**
1. `PressureScreen` - Workload monitoring
2. Weekly pressure calculation
3. Visual pressure indicators
4. Time distribution charts
5. Task load by day

**Estimated: 6 hours**

### Phase 9: Authentication (Week 4)
Priority: MEDIUM

**Screens to Create:**
1. `LoginScreen` - Login form
2. `SignupScreen` - Registration form
3. `AuthProvider` - Context provider
4. Supabase integration
5. Session management
6. Protected routes

**Estimated: 8 hours**

### Phase 10: Navigation & Layout (Week 5)
Priority: HIGH - UX improvement

**Components to Create:**
1. Drawer navigation (swipe from left)
2. Bottom tab bar enhancement
3. Header with user avatar
4. Settings screen
5. Profile screen
6. About/Help screen

**Estimated: 6 hours**

### Phase 11: Animations & Polish (Week 5)
Priority: LOW - Nice to have

**Enhancements:**
1. Page transitions
2. Card animations
3. Button press feedback
4. Loading states
5. Skeleton screens
6. Pull-to-refresh animations
7. Gesture handling

**Estimated: 6 hours**

### Phase 12: Offline Support (Week 6)
Priority: MEDIUM

**Features to Implement:**
1. Offline task creation
2. Sync queue
3. Network status detection
4. Conflict resolution
5. Optimistic updates

**Estimated: 8 hours**

## Total Estimated Time: 94 hours (6 weeks)

## Implementation Order (Critical Path)

### Immediate (This Session):
1. ✅ Create CircularProgress component
2. ✅ Create EnergyGauge component
3. ✅ Create enhanced TaskCard component
4. ✅ Create PlanCard component
5. ✅ Rebuild Dashboard screen
6. ✅ Create TaskDetailScreen
7. ✅ Create TaskCreationForm modal

### Next Session:
8. Voice Input component
9. Enhanced Chat with sidebar
10. Schedule screen with time blocks

### Following Sessions:
11. Authentication screens
12. Pressure monitoring
13. Animations and polish
14. Offline support

## Success Metrics

### Feature Parity: 100%
- All 9 web pages replicated
- All 18 UI components created
- All 25 features implemented

### UX Parity:
- Same design language (dark theme, gradients)
- Same interactions (tap, swipe, pull-to-refresh)
- Same animations (smooth transitions)
- Mobile-optimized layouts

### Performance:
- Smooth 60fps animations
- Fast load times (<2s)
- Efficient data syncing
- No memory leaks

## File Structure After Migration

```
apps/mobile/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CircularProgress.tsx
│   │   │   ├── EnergyGauge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ScheduleTimeBlock.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskCreationForm.tsx
│   │   │   ├── TaskDetailView.tsx
│   │   │   ├── SubtaskList.tsx
│   │   │   ├── DependencyList.tsx
│   │   │   └── TagsList.tsx
│   │   ├── plans/
│   │   │   ├── PlanCard.tsx
│   │   │   ├── PlanCreationModal.tsx
│   │   │   └── PlanDetailView.tsx
│   │   ├── chat/
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ChatHistory.tsx
│   │   └── auth/
│   │       ├── AuthProvider.tsx
│   │       ├── LoginForm.tsx
│   │       └── SignupForm.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   ├── TaskDetailScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── PlansScreen.tsx
│   │   ├── ScheduleScreen.tsx
│   │   ├── PressureScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   ├── DrawerNavigator.tsx
│   │   └── AuthNavigator.tsx
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   ├── usePlans.ts
│   │   ├── useAuth.ts
│   │   ├── useVoiceInput.ts
│   │   └── useSchedule.ts
│   └── utils/
│       ├── colors.ts
│       ├── animations.ts
│       └── formatters.ts
└── App.tsx
```

## Notes

- All shared logic already works (✅)
- Only UI layer needs migration
- Reuse exact same design from web
- Optimize for mobile screen sizes
- Add mobile-specific gestures
- Ensure accessibility
- Test on both iOS and Android

## Current Progress: 10%
## Target: 100% Feature Parity
