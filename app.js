class GymTracker {
    constructor() {
        this.currentProfile = null;
        this.currentMuscleGroup = null;
        this.currentExercise = null;
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.initializeData();
        this.bindEvents();
        this.showScreen('loading');
        
        // Simulate loading time
        setTimeout(() => {
            this.showScreen('main');
        }, 1500);
    }

    // Data Management
    createExercise(initialValue) {
        return {
            history: [{
                value: initialValue,
                date: new Date().toISOString()
            }]
        };
    }

    initializeData() {
        if (!this.data.profiles) {
            this.data = {
                muscleGroupNames: {
                    back: 'Back',
                    biceps: 'Biceps', 
                    legs: 'Legs',
                    triceps: 'Triceps',
                    shoulders: 'Shoulders',
                    chest: 'Chest'
                },
                profiles: {
                    elena: {
                        name: 'Elena',
                        exercises: {
                            back: {
                                'Upper back': this.createExercise('25kg'),
                                'Low row': this.createExercise('45kg'),
                                'Lat pulldown': this.createExercise('30kg'),
                                'Pulley': this.createExercise('25kg'),
                                'Pull-ups': this.createExercise('30kg')
                            },
                            biceps: {
                                'Bicep machine': this.createExercise('16kg'),
                                'Dumbbell curl': this.createExercise('12.5kg'),
                                'Cable curl': this.createExercise('12.5kg')
                            },
                            legs: {
                                'Abductor': this.createExercise('55kg'),
                                'Leg extension': this.createExercise('35kg'),
                                'Prone leg curl': this.createExercise('30kg'),
                                'Leg curl': this.createExercise('35kg'),
                                'Leg press': this.createExercise('90kg'),
                                'Deadlift': this.createExercise('20kg'),
                                'Calves': this.createExercise('80kg'),
                                'Inner thigh': this.createExercise('35kg')
                            },
                            triceps: {
                                'Tricep kickbacks': this.createExercise('9kg'),
                                'Cable bar': this.createExercise('20kg'),
                                'French press': this.createExercise('10kg'),
                                'Cable french press': this.createExercise('12.5kg')
                            },
                            shoulders: {
                                'Military press': this.createExercise('7.5kg'),
                                'Lateral raises': this.createExercise('7kg'),
                                'Face pull': this.createExercise('16kg'),
                                'Shoulder press': this.createExercise('15kg')
                            },
                            chest: {
                                'Chest fly': this.createExercise('20kg'),
                                'Chest press': this.createExercise('25kg')
                            }
                        }
                    },
                    adri: {
                        name: 'Adri',
                        exercises: {
                            biceps: {
                                'Bicep machine': this.createExercise('41kg'),
                                'Hammer curl': this.createExercise('15kg'),
                                'Cable curl': this.createExercise('17kg')
                            },
                            triceps: {
                                'Cable bar': this.createExercise('20kg'),
                                'Kickbacks': this.createExercise('12kg'),
                                'Standing french press': this.createExercise('12kg'),
                                'Cable french press': this.createExercise('15kg')
                            },
                            back: {
                                'Low row': this.createExercise('55kg'),
                                'Upper back': this.createExercise('35kg'),
                                'Pulley': this.createExercise('30kg'),
                                'Lat pulldown': this.createExercise('45kg')
                            },
                            legs: {
                                'Leg extension': this.createExercise('45kg'),
                                'Leg press': this.createExercise('80kg'),
                                'Prone leg curl': this.createExercise('32kg'),
                                'Leg curl': this.createExercise('40kg'),
                                'Abductor': this.createExercise('45kg'),
                                'Calves': this.createExercise('80kg'),
                                'Inner thigh': this.createExercise('20kg')
                            },
                            chest: {
                                'Chest press': this.createExercise('50kg'),
                                'Chest fly': this.createExercise('40kg')
                            },
                            shoulders: {
                                'Military press': this.createExercise('12.5kg'),
                                'Shoulder fly': this.createExercise('7.5kg'),
                                'Face pull': this.createExercise('15kg'),
                                'Shoulder press': this.createExercise('35kg')
                            }
                        }
                    }
                }
            };
            this.saveData();
        }
    }

    loadData() {
        try {
            const data = localStorage.getItem('gymTrackerData');
            const parsed = data ? JSON.parse(data) : {};
            
            // Backward compatibility: add muscleGroupNames if missing
            if (parsed.profiles && !parsed.muscleGroupNames) {
                parsed.muscleGroupNames = {
                    back: 'Back',
                    biceps: 'Biceps', 
                    legs: 'Legs',
                    triceps: 'Triceps',
                    shoulders: 'Shoulders',
                    chest: 'Chest'
                };
            }
            
            return parsed;
        } catch (error) {
            console.error('Error loading data:', error);
            return {};
        }
    }

    saveData() {
        try {
            localStorage.setItem('gymTrackerData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }


    createHistoryEntry(value) {
        return {
            value: value,
            date: new Date().toISOString()
        };
    }

    getCurrentValue(exercise) {
        if (exercise.history && exercise.history.length > 0) {
            return exercise.history[0].value; // Most recent is first
        }
        return exercise.value || '0kg'; // Fallback for old format
    }

    getLastThreeWeights(exercise) {
        if (exercise.history && exercise.history.length > 0) {
            return exercise.history.slice(0, 3); // Get last 3 entries
        }
        return [];
    }

    // Event Bindings
    bindEvents() {
        // Profile selection
        document.querySelectorAll('.profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const profile = e.currentTarget.dataset.profile;
                this.selectProfile(profile);
            });
        });

        // Navigation
        document.getElementById('back-to-main').addEventListener('click', () => {
            this.showScreen('main');
        });

        document.getElementById('back-to-groups').addEventListener('click', () => {
            this.updateMuscleGroupButtons();
            this.showScreen('muscle-groups');
        });

        // Muscle group selection
        document.querySelectorAll('.muscle-group-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const group = e.currentTarget.dataset.group;
                this.selectMuscleGroup(group);
            });
        });

        // Modal events
        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('save-edit').addEventListener('click', () => {
            this.saveExercise();
        });

        // Close modal on backdrop click
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });

        // Enter key in input
        document.getElementById('exercise-value').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveExercise();
            }
        });

        // Add exercise events
        document.getElementById('add-exercise-btn').addEventListener('click', () => {
            this.showAddModal();
        });

        document.getElementById('cancel-add').addEventListener('click', () => {
            this.hideAddModal();
        });

        document.getElementById('save-add').addEventListener('click', () => {
            this.addNewExercise();
        });

        // Close add modal on backdrop click
        document.getElementById('add-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideAddModal();
            }
        });

        // Enter key in add modal inputs
        document.getElementById('new-exercise-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('new-exercise-value').focus();
            }
        });

        document.getElementById('new-exercise-value').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addNewExercise();
            }
        });

        // Full history events
        document.getElementById('see-all-history').addEventListener('click', () => {
            this.showFullHistory();
        });

        document.getElementById('back-to-edit').addEventListener('click', () => {
            this.hideFullHistory();
        });

        // Close full history modal on backdrop click
        document.getElementById('full-history-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideFullHistory();
            }
        });

        // Edit exercise name in modal
        document.getElementById('edit-name-btn').addEventListener('click', () => {
            this.editExerciseName(this.currentExercise);
        });

        // Edit muscle group name
        document.getElementById('edit-muscle-group-btn').addEventListener('click', () => {
            this.editMuscleGroupName(this.currentMuscleGroup);
        });
    }

    // Navigation
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(`${screenName}-screen`).classList.remove('hidden');
    }

    selectProfile(profileKey) {
        this.currentProfile = profileKey;
        const profile = this.data.profiles[profileKey];
        document.getElementById('profile-title').textContent = profile.name;
        this.updateMuscleGroupButtons();
        this.showScreen('muscle-groups');
    }

    selectMuscleGroup(group) {
        this.currentMuscleGroup = group;
        const displayName = this.data.muscleGroupNames ? this.data.muscleGroupNames[group] : this.capitalize(group);
        document.getElementById('muscle-group-title').textContent = displayName;
        this.renderExercises();
        this.showScreen('exercises');
    }

    renderExercises() {
        const exercisesList = document.getElementById('exercises-list');
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup] || {};
        
        exercisesList.innerHTML = '';
        
        Object.entries(exercises).forEach(([name, data]) => {
            const currentValue = this.getCurrentValue(data);
            const lastModified = data.history && data.history.length > 0 ? data.history[0].date : new Date().toISOString();
            
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card';
            exerciseCard.innerHTML = `
                <div class="exercise-info">
                    <h3>${name}</h3>
                    <div class="last-modified">${this.formatDate(lastModified)}</div>
                </div>
                <div class="exercise-value">${currentValue}</div>
            `;
            
            exerciseCard.addEventListener('click', () => {
                this.editExercise(name, currentValue);
            });
            
            exercisesList.appendChild(exerciseCard);
        });
    }

    editExercise(exerciseName, currentValue) {
        this.currentExercise = exerciseName;
        document.getElementById('edit-exercise-name').textContent = exerciseName;
        document.getElementById('exercise-value').value = '';
        
        // Populate history
        this.populateHistory(exerciseName);
        
        this.showModal();
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('exercise-value');
            input.focus();
        }, 100);
    }

    editExerciseName(currentName) {
        const nameElement = document.getElementById('edit-exercise-name');
        if (!nameElement) return;
        
        // Create inline input
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'exercise-name-input';
        
        // Replace name with input
        nameElement.style.display = 'none';
        nameElement.parentNode.insertBefore(input, nameElement);
        input.focus();
        input.select();
        
        // Save on blur or enter
        const saveEdit = () => {
            const newName = input.value.trim();
            if (!newName) {
                alert('Exercise name cannot be empty');
                input.focus();
                return;
            }
            
            if (newName === currentName) {
                // No change, just restore
                nameElement.style.display = 'block';
                input.remove();
                return;
            }
            
            // Check for duplicate names
            const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
            if (exercises[newName]) {
                alert('An exercise with this name already exists');
                input.focus();
                return;
            }
            
            // Update data structure - move exercise data to new key
            exercises[newName] = exercises[currentName];
            delete exercises[currentName];
            
            // Update current exercise reference
            this.currentExercise = newName;
            
            // Update modal title
            nameElement.textContent = newName;
            
            // Update full history modal title if it's open
            const fullHistoryModal = document.getElementById('full-history-modal');
            if (!fullHistoryModal.classList.contains('hidden')) {
                document.getElementById('full-history-exercise-name').textContent = `${newName} - Full History`;
            }
            
            // Save and refresh
            this.saveData();
            this.renderExercises();
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                nameElement.style.display = 'block';
                input.remove();
            }
        });
    }

    editMuscleGroupName(muscleGroupKey) {
        const titleElement = document.getElementById('muscle-group-title');
        if (!titleElement) return;
        
        // Ensure muscleGroupNames exists
        if (!this.data.muscleGroupNames) {
            this.data.muscleGroupNames = {
                back: 'Back',
                biceps: 'Biceps', 
                legs: 'Legs',
                triceps: 'Triceps',
                shoulders: 'Shoulders',
                chest: 'Chest'
            };
        }
        
        const currentName = this.data.muscleGroupNames[muscleGroupKey] || this.capitalize(muscleGroupKey);
        
        // Create inline input
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'muscle-group-name-input';
        
        // Replace title with input
        titleElement.style.display = 'none';
        titleElement.parentNode.insertBefore(input, titleElement);
        input.focus();
        input.select();
        
        // Save on blur or enter
        const saveEdit = () => {
            const newName = input.value.trim();
            if (!newName) {
                alert('Muscle group name cannot be empty');
                input.focus();
                return;
            }
            
            if (newName === currentName) {
                // No change, just restore
                titleElement.style.display = 'block';
                input.remove();
                return;
            }
            
            // Update muscle group name
            this.data.muscleGroupNames[muscleGroupKey] = newName;
            
            // Update title
            titleElement.textContent = newName;
            titleElement.style.display = 'block';
            input.remove();
            
            // Save and update muscle groups screen if needed
            this.saveData();
            this.updateMuscleGroupButtons();
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                titleElement.style.display = 'block';
                input.remove();
            }
        });
    }

    updateMuscleGroupButtons() {
        // Update muscle group buttons with custom names
        const buttons = document.querySelectorAll('.muscle-group-btn');
        buttons.forEach(btn => {
            const group = btn.dataset.group;
            const displayName = this.data.muscleGroupNames ? this.data.muscleGroupNames[group] : this.capitalize(group);
            btn.querySelector('span').textContent = displayName;
        });
    }

    populateHistory(exerciseName) {
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        const exercise = exercises[exerciseName];
        const historyList = document.getElementById('history-list');
        
        historyList.innerHTML = '';
        
        if (exercise && exercise.history && exercise.history.length > 0) {
            const lastThree = this.getLastThreeWeights(exercise);
            // Reverse to show oldest first, newest last (chronological order)
            const chronological = [...lastThree].reverse();
            
            chronological.forEach((entry, index) => {
                const historyEntry = document.createElement('div');
                const isLatest = index === chronological.length - 1;
                const originalIndex = lastThree.length - 1 - index; // Get original index in history array
                
                historyEntry.className = `history-entry ${isLatest ? 'current' : ''}`;
                historyEntry.innerHTML = `
                    <div class="history-content">
                        <div class="history-value" data-index="${originalIndex}">${entry.value}</div>
                        <div class="history-date">${this.formatDate(entry.date)}</div>
                    </div>
                    <div class="history-actions">
                        <button class="history-btn edit-btn" data-index="${originalIndex}" title="Edit">✏️</button>
                        <button class="history-btn delete-btn" data-index="${originalIndex}" title="Delete">🗑️</button>
                    </div>
                `;
                
                // Add event listeners for edit and delete
                const editBtn = historyEntry.querySelector('.edit-btn');
                const deleteBtn = historyEntry.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editHistoryEntry(originalIndex);
                });
                
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteHistoryEntry(originalIndex);
                });
                
                historyList.appendChild(historyEntry);
            });
        } else {
            historyList.innerHTML = '<div class="history-entry"><div class="history-value">No history yet</div></div>';
        }
    }

    editHistoryEntry(historyIndex) {
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        const exercise = exercises[this.currentExercise];
        const entry = exercise.history[historyIndex];
        
        const valueElement = document.querySelector(`[data-index="${historyIndex}"]`);
        const currentValue = entry.value;
        
        // Create inline input
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.className = 'history-edit-input';
        
        // Replace value with input
        valueElement.style.display = 'none';
        valueElement.parentNode.insertBefore(input, valueElement);
        input.focus();
        input.select();
        
        // Save on blur or enter
        const saveEdit = () => {
            const newValue = input.value.trim();
            if (newValue && newValue !== currentValue) {
                exercise.history[historyIndex].value = newValue;
                exercise.history[historyIndex].date = new Date().toISOString();
                this.saveData();
            }
            
            // Restore display
            valueElement.textContent = newValue || currentValue;
            valueElement.style.display = 'block';
            input.remove();
            
            // Re-render to update current exercise display if needed
            this.renderExercises();
            
            // If full history is open, refresh it too
            const fullHistoryModal = document.getElementById('full-history-modal');
            if (!fullHistoryModal.classList.contains('hidden')) {
                this.populateFullHistory();
            }
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                valueElement.style.display = 'block';
                input.remove();
            }
        });
    }

    deleteHistoryEntry(historyIndex) {
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        const exercise = exercises[this.currentExercise];
        
        // Don't allow deleting if it's the only entry
        if (exercise.history.length <= 1) {
            alert('Cannot delete the only history entry. Add a new weight first.');
            return;
        }
        
        if (confirm('Delete this weight entry?')) {
            exercise.history.splice(historyIndex, 1);
            this.saveData();
            this.populateHistory(this.currentExercise);
            this.renderExercises();
        }
    }

    saveExercise() {
        const newValue = document.getElementById('exercise-value').value.trim();
        if (!newValue) return;

        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        const exercise = exercises[this.currentExercise];
        
        // Add new entry to beginning of history array (most recent first)
        if (exercise && exercise.history) {
            exercise.history.unshift(this.createHistoryEntry(newValue));
            // Keep only last 10 entries to prevent unlimited growth
            if (exercise.history.length > 10) {
                exercise.history = exercise.history.slice(0, 10);
            }
        } else {
            // Create new exercise with history if it doesn't exist
            exercises[this.currentExercise] = this.createExercise(newValue);
        }

        this.saveData();
        this.renderExercises();
        this.hideModal();
    }

    showModal() {
        document.getElementById('edit-modal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('edit-modal').classList.add('hidden');
    }

    showAddModal() {
        document.getElementById('new-exercise-name').value = '';
        document.getElementById('new-exercise-value').value = '';
        document.getElementById('add-modal').classList.remove('hidden');
        
        // Focus on name input
        setTimeout(() => {
            document.getElementById('new-exercise-name').focus();
        }, 100);
    }

    hideAddModal() {
        document.getElementById('add-modal').classList.add('hidden');
    }

    showFullHistory() {
        const exerciseName = this.currentExercise;
        document.getElementById('full-history-exercise-name').textContent = `${exerciseName} - Full History`;
        this.populateFullHistory();
        document.getElementById('full-history-modal').classList.remove('hidden');
    }

    hideFullHistory() {
        document.getElementById('full-history-modal').classList.add('hidden');
    }

    populateFullHistory() {
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        const exercise = exercises[this.currentExercise];
        const fullHistoryList = document.getElementById('full-history-list');
        
        fullHistoryList.innerHTML = '';
        
        if (exercise && exercise.history && exercise.history.length > 0) {
            // Show all history in chronological order (oldest first, newest last)
            const allHistory = [...exercise.history].reverse();
            
            allHistory.forEach((entry, index) => {
                const originalIndex = exercise.history.length - 1 - index;
                const isLatest = index === allHistory.length - 1;
                
                const historyEntry = document.createElement('div');
                historyEntry.className = `history-entry ${isLatest ? 'current' : ''}`;
                historyEntry.innerHTML = `
                    <div class="history-content">
                        <div class="history-value" data-index="${originalIndex}">${entry.value}</div>
                        <div class="history-date">${this.formatDate(entry.date)}</div>
                    </div>
                    <div class="history-actions">
                        <button class="history-btn edit-btn" data-index="${originalIndex}" title="Edit">✏️</button>
                        <button class="history-btn delete-btn" data-index="${originalIndex}" title="Delete">🗑️</button>
                    </div>
                `;
                
                // Add event listeners for edit and delete
                const editBtn = historyEntry.querySelector('.edit-btn');
                const deleteBtn = historyEntry.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editHistoryEntry(originalIndex);
                });
                
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteHistoryEntryFromFullView(originalIndex);
                });
                
                fullHistoryList.appendChild(historyEntry);
            });
        } else {
            fullHistoryList.innerHTML = '<div class="history-entry"><div class="history-content"><div class="history-value">No history yet</div></div></div>';
        }
    }

    deleteHistoryEntryFromFullView(historyIndex) {
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        const exercise = exercises[this.currentExercise];
        
        // Don't allow deleting if it's the only entry
        if (exercise.history.length <= 1) {
            alert('Cannot delete the only history entry. Add a new weight first.');
            return;
        }
        
        if (confirm('Delete this weight entry?')) {
            exercise.history.splice(historyIndex, 1);
            this.saveData();
            this.populateFullHistory(); // Refresh full history
            this.renderExercises(); // Update main exercise list
        }
    }

    addNewExercise() {
        const exerciseName = document.getElementById('new-exercise-name').value.trim();
        const exerciseValue = document.getElementById('new-exercise-value').value.trim();

        // Validation
        if (!exerciseName) {
            alert('Please enter an exercise name');
            document.getElementById('new-exercise-name').focus();
            return;
        }

        if (!exerciseValue) {
            alert('Please enter an initial weight/value');
            document.getElementById('new-exercise-value').focus();
            return;
        }

        // Check for duplicate exercise names
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup] || {};
        if (exercises[exerciseName]) {
            alert('An exercise with this name already exists');
            document.getElementById('new-exercise-name').focus();
            return;
        }

        // Add the new exercise
        if (!this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup]) {
            this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup] = {};
        }

        this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup][exerciseName] = this.createExercise(exerciseValue);

        // Save and refresh
        this.saveData();
        this.renderExercises();
        this.hideAddModal();
    }

    // Utility functions
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GymTracker();
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}