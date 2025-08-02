# Gym Tracker - Feature Documentation

This document provides comprehensive documentation of all implemented features for developers, LLMs, and contributors.

## Table of Contents
- [Core Features](#core-features)
- [User Interface](#user-interface) 
- [Data Management](#data-management)
- [PWA Features](#pwa-features)
- [Technical Implementation](#technical-implementation)
- [File Structure](#file-structure)

## Core Features

### Profile Management
**Files**: `app.js` (lines 193-198), `index.html` (lines 31-42)
- Dual profile system for Elena and Adri
- Profile switching via main screen buttons
- Cross-profile data visibility
- Current profile state tracking (`this.currentProfile`)

### Exercise Management
**Files**: `app.js` (lines 317-356), `index.html` (lines 113-130)

#### View Exercises
- Dynamic exercise list rendering (`renderExercises()`)
- Shows current weight/value and last modified date
- Organized by muscle groups within profiles

#### Edit Exercises  
- Inline editing via tap-to-edit interface
- Modal popup with current value pre-filled
- Auto-save to localStorage on change
- Input validation and focus management

#### Add New Exercises ⭐ *Recently Added*
- '+' button in exercises screen header
- Modal with exercise name and initial value fields
- Duplicate name validation within muscle groups
- Auto-save and immediate UI refresh

### Muscle Group Organization
**Files**: `app.js` (initializeData method), `index.html` (lines 58-84)
- 6 predefined groups: Back, Biceps, Legs, Triceps, Shoulders, Chest
- Consistent structure across both profiles
- Navigation state tracking (`this.currentMuscleGroup`)

### Data Structure
**Files**: `app.js` (lines 22-120)
```javascript
{
  profiles: {
    elena: {
      name: 'Elena',
      exercises: {
        back: {
          'Exercise Name': {
            value: '25kg',
            lastModified: '2025-01-01T12:00:00.000Z'
          }
        }
      }
    }
  }
}
```

## User Interface

### Screens & Navigation
**Files**: `index.html`, `styles.css`, `app.js` (showScreen method)

1. **Loading Screen** (`#loading-screen`)
   - App logo and branding
   - 1.5 second display duration
   - Smooth transition to main screen

2. **Main Screen** (`#main-screen`)
   - Profile selector buttons
   - Visual profile icons with gradients
   - Entry point for app navigation

3. **Muscle Groups Screen** (`#muscle-groups-screen`)
   - List of 6 muscle group buttons
   - Back navigation to main screen
   - Profile name in header

4. **Exercises Screen** (`#exercises-screen`)
   - Exercise list with current values
   - '+' button for adding new exercises
   - Back navigation to muscle groups

### Modals
**Files**: `index.html` (lines 98-130), `styles.css` (modal classes)

1. **Edit Modal** (`#edit-modal`)
   - Edit existing exercise values
   - Pre-filled with current value
   - Enter key submission

2. **Add Modal** (`#add-modal`) ⭐ *Recently Added*
   - Add new exercises to current muscle group
   - Two input fields: name and initial value
   - Enter key navigation between fields

### Design System
**Files**: `styles.css`
- **Color Scheme**: Dark theme with CSS custom properties
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont)
- **Spacing**: Consistent padding and margins
- **Touch Targets**: 44px minimum for accessibility
- **Animations**: Smooth transitions and hover effects

## Data Management

### localStorage Integration
**Files**: `app.js` (loadData, saveData methods)
- Key: `'gymTrackerData'`
- JSON serialization/deserialization
- Error handling for storage failures
- Automatic data initialization on first run

### Data Operations
- **Load**: `loadData()` - Retrieves and parses stored data
- **Save**: `saveData()` - Serializes and stores current data
- **Initialize**: `initializeData()` - Sets up default data structure
- **Validate**: Built-in validation for required fields and duplicates

### State Management
**Files**: `app.js` (constructor and throughout)
- `this.currentProfile`: Currently selected profile (elena/adri)
- `this.currentMuscleGroup`: Currently viewed muscle group
- `this.currentExercise`: Exercise being edited (modal state)
- `this.data`: Complete application data structure

## PWA Features

### Service Worker
**Files**: `sw.js`
- Caches all app resources for offline use
- Cache name: `'gym-tracker-v1'`
- Network-first strategy with cache fallback
- Automatic cache cleanup on updates

### Web App Manifest
**Files**: `manifest.json`
- App metadata and icons
- Display mode: `standalone`
- Theme colors: Dark (`#1a1a1a`)
- Icon sizes: 192x192 and 512x512 SVG

### Offline Functionality
- Complete app functionality without internet
- localStorage persistence across sessions
- Cached resources for instant loading
- Service worker registration in `app.js`

## Technical Implementation

### Event Handling
**Files**: `app.js` (bindEvents method, lines 134-215)

#### Profile Selection
```javascript
document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const profile = e.currentTarget.dataset.profile;
        this.selectProfile(profile);
    });
});
```

#### Add Exercise Events ⭐ *Recently Added*
```javascript
// Add button click
document.getElementById('add-exercise-btn').addEventListener('click', () => {
    this.showAddModal();
});

// Save new exercise
document.getElementById('save-add').addEventListener('click', () => {
    this.addNewExercise();
});
```

### Key Methods
**Files**: `app.js`

#### Core Navigation
- `showScreen(screenName)`: Screen management and transitions
- `selectProfile(profileKey)`: Profile switching logic
- `selectMuscleGroup(group)`: Muscle group navigation

#### Exercise Operations
- `renderExercises()`: Dynamic exercise list generation
- `editExercise(name, value)`: Edit modal initialization
- `saveExercise()`: Save edited exercise values
- `addNewExercise()`: Add new exercise with validation ⭐

#### Modal Management
- `showModal()` / `hideModal()`: Edit modal control
- `showAddModal()` / `hideAddModal()`: Add modal control ⭐

#### Utility Functions
- `capitalize(str)`: String capitalization helper
- `formatDate(isoString)`: Human-readable date formatting

### Validation Logic ⭐ *Recently Added*
**Files**: `app.js` (addNewExercise method, lines 317-356)
```javascript
// Required field validation
if (!exerciseName || !exerciseValue) {
    alert('Please fill in all fields');
    return;
}

// Duplicate name validation
if (exercises[exerciseName]) {
    alert('An exercise with this name already exists');
    return;
}
```

## File Structure

```
gym-tracker-app/
├── index.html              # Main HTML structure
├── styles.css              # All styling and design system
├── app.js                  # Main application logic
├── manifest.json           # PWA manifest configuration  
├── sw.js                   # Service worker for offline functionality
├── server.py               # Development server
├── package.json            # Project metadata
├── README.md               # Project overview and specifications
├── FEATURES.md             # This file - comprehensive feature docs
├── DEPLOYMENT.md           # Deployment instructions
├── .gitignore              # Git ignore rules
└── icons/                  # PWA icons
    ├── icon-192x192.svg    # App icon (192px)
    └── icon-512x512.svg    # App icon (512px)
```

## Recent Changes

### Add New Exercises Feature ⭐
**Added**: January 2025
**Files Modified**: `index.html`, `app.js`, `styles.css`

**New Elements**:
- Add button (`#add-exercise-btn`) in exercises screen header
- Add exercise modal (`#add-modal`) with name and value inputs
- `addNewExercise()` method with comprehensive validation
- CSS styling for add button with hover effects

**User Flow**:
1. Navigate to any muscle group exercise list
2. Click '+' button in header
3. Enter exercise name and initial weight/value
4. Press Enter or click 'Add Exercise'
5. Exercise appears in list immediately

**Technical Details**:
- Prevents duplicate exercise names within muscle groups
- Validates required fields before saving
- Auto-focuses inputs for better UX
- Maintains consistent data structure
- Preserves last modified timestamps

---

*This documentation is maintained alongside feature development. Update this file when adding new features or modifying existing functionality.*