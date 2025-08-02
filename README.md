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
- **Exercises**: Predefined list per group and per person
- **Values**: Generic field for weight (kg), reps, or description ("green elastic band")
- **Last modified date**: For each individual exercise

### 3. Navigation
- Main screen: Profile selector + muscle groups
- Group screen: Exercise list with current values
- Inline editing: Tap exercise → edit value → auto-save

### 4. Storage
- **Local only** for MVP (browser localStorage)
- No cloud sync initially
- Data persists between sessions

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

1. **Open app** → Main screen with profiles
2. **Select profile** → Elena or Adri
3. **Choose muscle group** → e.g., "Back"
4. **View exercises** → List with current values
5. **Edit weight** → Tap exercise → change value → auto-save
6. **Continue** → Next exercise or change group

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