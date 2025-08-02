# Gym Tracker App - MVP Specifications

## Objective
Create a Progressive Web App (PWA) to replace the current iOS Notes app usage for tracking gym exercises and weights. Priority is speed, simplicity, and comfort of use during workouts.

## Users
- **Elena and Adri**: Two separate profiles on the same device
- Both can view each other's exercises
- Single mobile device (initially)

## Core Features

### 1. Profile Management
- Prominent Elena/Adri selector on main screen
- Quick profile switching
- Cross-visibility of data

### 2. Data Structure
- **Muscle groups**: Back, Biceps, Legs, Triceps, Shoulders, Chest
- **Exercises**: Predefined list per group and per person + ability to add new exercises
- **Values**: Generic field for weight (kg), reps, or description ("green elastic band")
- **Last modified date**: For each individual exercise

### 3. Navigation
- Main screen: Profile selector + muscle groups
- Group screen: Exercise list with current values + add button
- Inline editing: Tap exercise → edit value → auto-save
- Add exercises: Tap '+' button → enter name and value → auto-save

### 4. Storage
- **Local only** for MVP (browser localStorage)
- No cloud sync initially
- Data persists between sessions

## Feature Registry

### Implemented Features (Current Version)

#### 🏠 **Main Screen**
- Profile selector with Elena and Adri options
- Visual profile icons with gradient backgrounds
- Loading screen with app branding
- Dark theme optimized for gym environments

#### 👤 **Profile Management**
- Dual profile system (Elena/Adri)
- Quick profile switching from main screen
- Cross-visibility: both users can view each other's data
- Individual exercise tracking per profile

#### 💪 **Muscle Group Organization**
- 6 predefined muscle groups: Back, Biceps, Legs, Triceps, Shoulders, Chest
- Visual muscle group buttons with navigation arrows
- Consistent naming and organization across profiles

#### 🏋️ **Exercise Management**
- **View Exercises**: List view with current values and last modified dates
- **Edit Exercises**: Tap any exercise to edit weight/value inline
- **Add New Exercises**: '+' button to add custom exercises to any muscle group
- **Validation**: Prevents duplicate exercise names within muscle groups
- **Auto-save**: All changes automatically saved to localStorage

#### 🎯 **User Experience**
- **Touch-friendly**: All buttons sized for gym gloves (44px minimum)
- **Keyboard navigation**: Enter key navigation in modals
- **Visual feedback**: Hover effects and smooth animations
- **Error handling**: User-friendly validation messages
- **Fast navigation**: <3 taps to reach any exercise
- **Quick editing**: <5 seconds to edit any weight

#### 📱 **Progressive Web App (PWA)**
- **Installable**: Can be installed from browser as native app
- **Offline functionality**: Full app works without internet connection
- **Service worker**: Caches all resources for offline use
- **App manifest**: Proper PWA configuration with icons
- **Fast loading**: <2 second load times even on slow connections

#### 💾 **Data Management**
- **localStorage persistence**: All data stored locally in browser
- **JSON data structure**: Organized profiles → muscle groups → exercises
- **Last modified tracking**: Timestamps for each exercise update
- **No cloud dependency**: Works completely offline
- **Data integrity**: Validation prevents data corruption

#### 🎨 **Design System**
- **Dark theme**: Default dark mode perfect for gym lighting
- **Apple-inspired design**: Clean, minimalist aesthetic
- **Consistent spacing**: 8px grid system throughout
- **Typography**: System fonts for optimal readability
- **Color palette**: Blue/green accents on dark background
- **Responsive design**: Mobile-first, single-column layout

#### ⌨️ **Keyboard & Input**
- **Enter key submission**: Quick form completion
- **Tab navigation**: Logical focus order
- **Input validation**: Real-time field validation
- **Placeholder text**: Helpful input guidance
- **Auto-focus**: Inputs automatically focused when modals open

#### 🔄 **State Management**
- **Current profile tracking**: Remembers selected profile
- **Current muscle group**: Maintains navigation context
- **Modal state**: Proper show/hide modal management
- **Data synchronization**: UI updates reflect data changes immediately

### Future Features (Planned)
- Cloud synchronization
- Workout history and progress tracking
- Progress charts and analytics
- Rest timer between sets
- Data export functionality
- Workout sharing capabilities
- Exercise templates and presets
- Workout routines and scheduling

### Technical Architecture
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage API
- **PWA**: Service Worker + Web App Manifest
- **Icons**: SVG-based scalable graphics
- **Development**: Python HTTP server
- **Production**: Static file hosting (Vercel compatible)
- **No dependencies**: Zero external libraries or frameworks

## Initial Data to Import

### Elena
**Back**: Upper back (25kg), Low row (45kg), Lat pulldown (30kg), Pulley (25kg), Pull-ups (30kg)
**Biceps**: Bicep machine (16kg), Dumbbell curl (12.5kg), Cable curl (12.5kg)
**Legs**: Abductor (55kg), Leg extension (35kg), Prone leg curl (30kg), Leg curl (35kg), Leg press (90kg), Deadlift (20kg), Calves (80kg), Inner thigh (35kg)
**Triceps**: Tricep kickbacks (9kg), Cable bar (20kg), French press (10kg), Cable french press (12.5kg)
**Shoulders**: Military press (7.5kg), Lateral raises (7kg), Face pull (16kg), Shoulder press (15kg)
**Chest**: Chest fly (20kg), Chest press (25kg)

### Adri
**Biceps**: Bicep machine (41kg), Hammer curl (15kg), Cable curl (17kg)
**Triceps**: Cable bar (20kg), Kickbacks (12kg), Standing french press (12kg), Cable french press (15kg)
**Back**: Low row (55kg), Upper back (35kg), Pulley (30kg), Lat pulldown (45kg)
**Legs**: Leg extension (45kg), Leg press (80kg), Prone leg curl (32kg), Leg curl (40kg), Abductor (45kg), Calves (80kg), Inner thigh (20kg)
**Chest**: Chest press (50kg), Chest fly (40kg)
**Shoulders**: Military press (12.5kg), Shoulder fly (7.5kg), Face pull (15kg), Shoulder press (35kg)

## Design and UX

### Visual Style
- **Inspiration**: Minimalist and elegant Apple-style design
- **Theme**: Dark mode by default (ideal for gyms)
- **Colors**: Dark gray base with subtle blue/green accents
- **Typography**: San Francisco/system fonts, large readable numbers

### UI Components
- **Cards**: Each exercise in subtle shadow cards
- **Buttons**: Large, rounded, easy to tap
- **States**: Clear visual feedback when saving changes
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design
- Mobile-optimized (primary viewport)
- Buttons and text large enough for use with gloves
- Single column, vertical navigation

## Technical Specifications

### Technology
- **Frontend**: HTML5, CSS3, JavaScript (vanilla or React)
- **PWA**: Service worker for offline functionality
- **Storage**: Browser localStorage
- **Responsive**: Mobile-first design

### Technical Features
- Works completely offline
- Installable as app from browser
- Data persists locally
- Fast loading (< 2 seconds)

## Typical User Flow

### Basic Workout Tracking
1. **Open app** → Main screen with profiles
2. **Select profile** → Elena or Adri
3. **Choose muscle group** → e.g., "Back"
4. **View exercises** → List with current values
5. **Edit weight** → Tap exercise → change value → auto-save
6. **Continue** → Next exercise or change group

### Adding New Exercises
1. **Navigate to muscle group** → Follow steps 1-3 above
2. **Add exercise** → Tap '+' button in exercise list
3. **Enter details** → Exercise name and initial weight
4. **Save** → Press Enter or tap 'Add Exercise'
5. **Use immediately** → New exercise appears in list ready to track

## MVP Success Criteria
- ✅ Completely replaces current Notes app usage
- ✅ Navigation in < 3 taps for any exercise
- ✅ Weight editing in < 5 seconds
- ✅ Attractive and professional interface
- ✅ Works offline without issues
- ✅ Fast loading even with slow gym connection

## Future Features (Post-MVP)
- Cloud synchronization
- Workout history
- Progress charts
- Rest timer between sets
- Data export
- Workout sharing

## Deployment
- **Development**: Local server during development
- **Production**: Vercel (connected to GitHub repo)
- **Installation**: PWA installable from Safari/Chrome browser
- **Platform**: Works on iOS and Android through browsers