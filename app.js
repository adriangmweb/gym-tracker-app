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
    initializeData() {
        if (!this.data.profiles) {
            this.data = {
                profiles: {
                    elena: {
                        name: 'Elena',
                        exercises: {
                            back: {
                                'Upper back': { value: '25kg', lastModified: new Date().toISOString() },
                                'Low row': { value: '45kg', lastModified: new Date().toISOString() },
                                'Lat pulldown': { value: '30kg', lastModified: new Date().toISOString() },
                                'Pulley': { value: '25kg', lastModified: new Date().toISOString() },
                                'Pull-ups': { value: '30kg', lastModified: new Date().toISOString() }
                            },
                            biceps: {
                                'Bicep machine': { value: '16kg', lastModified: new Date().toISOString() },
                                'Dumbbell curl': { value: '12.5kg', lastModified: new Date().toISOString() },
                                'Cable curl': { value: '12.5kg', lastModified: new Date().toISOString() }
                            },
                            legs: {
                                'Abductor': { value: '55kg', lastModified: new Date().toISOString() },
                                'Leg extension': { value: '35kg', lastModified: new Date().toISOString() },
                                'Prone leg curl': { value: '30kg', lastModified: new Date().toISOString() },
                                'Leg curl': { value: '35kg', lastModified: new Date().toISOString() },
                                'Leg press': { value: '90kg', lastModified: new Date().toISOString() },
                                'Deadlift': { value: '20kg', lastModified: new Date().toISOString() },
                                'Calves': { value: '80kg', lastModified: new Date().toISOString() },
                                'Inner thigh': { value: '35kg', lastModified: new Date().toISOString() }
                            },
                            triceps: {
                                'Tricep kickbacks': { value: '9kg', lastModified: new Date().toISOString() },
                                'Cable bar': { value: '20kg', lastModified: new Date().toISOString() },
                                'French press': { value: '10kg', lastModified: new Date().toISOString() },
                                'Cable french press': { value: '12.5kg', lastModified: new Date().toISOString() }
                            },
                            shoulders: {
                                'Military press': { value: '7.5kg', lastModified: new Date().toISOString() },
                                'Lateral raises': { value: '7kg', lastModified: new Date().toISOString() },
                                'Face pull': { value: '16kg', lastModified: new Date().toISOString() },
                                'Shoulder press': { value: '15kg', lastModified: new Date().toISOString() }
                            },
                            chest: {
                                'Chest fly': { value: '20kg', lastModified: new Date().toISOString() },
                                'Chest press': { value: '25kg', lastModified: new Date().toISOString() }
                            }
                        }
                    },
                    adri: {
                        name: 'Adri',
                        exercises: {
                            biceps: {
                                'Bicep machine': { value: '41kg', lastModified: new Date().toISOString() },
                                'Hammer curl': { value: '15kg', lastModified: new Date().toISOString() },
                                'Cable curl': { value: '17kg', lastModified: new Date().toISOString() }
                            },
                            triceps: {
                                'Cable bar': { value: '20kg', lastModified: new Date().toISOString() },
                                'Kickbacks': { value: '12kg', lastModified: new Date().toISOString() },
                                'Standing french press': { value: '12kg', lastModified: new Date().toISOString() },
                                'Cable french press': { value: '15kg', lastModified: new Date().toISOString() }
                            },
                            back: {
                                'Low row': { value: '55kg', lastModified: new Date().toISOString() },
                                'Upper back': { value: '35kg', lastModified: new Date().toISOString() },
                                'Pulley': { value: '30kg', lastModified: new Date().toISOString() },
                                'Lat pulldown': { value: '45kg', lastModified: new Date().toISOString() }
                            },
                            legs: {
                                'Leg extension': { value: '45kg', lastModified: new Date().toISOString() },
                                'Leg press': { value: '80kg', lastModified: new Date().toISOString() },
                                'Prone leg curl': { value: '32kg', lastModified: new Date().toISOString() },
                                'Leg curl': { value: '40kg', lastModified: new Date().toISOString() },
                                'Abductor': { value: '45kg', lastModified: new Date().toISOString() },
                                'Calves': { value: '80kg', lastModified: new Date().toISOString() },
                                'Inner thigh': { value: '20kg', lastModified: new Date().toISOString() }
                            },
                            chest: {
                                'Chest press': { value: '50kg', lastModified: new Date().toISOString() },
                                'Chest fly': { value: '40kg', lastModified: new Date().toISOString() }
                            },
                            shoulders: {
                                'Military press': { value: '12.5kg', lastModified: new Date().toISOString() },
                                'Shoulder fly': { value: '7.5kg', lastModified: new Date().toISOString() },
                                'Face pull': { value: '15kg', lastModified: new Date().toISOString() },
                                'Shoulder press': { value: '35kg', lastModified: new Date().toISOString() }
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
            return data ? JSON.parse(data) : {};
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
        this.showScreen('muscle-groups');
    }

    selectMuscleGroup(group) {
        this.currentMuscleGroup = group;
        document.getElementById('muscle-group-title').textContent = this.capitalize(group);
        this.renderExercises();
        this.showScreen('exercises');
    }

    renderExercises() {
        const exercisesList = document.getElementById('exercises-list');
        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup] || {};
        
        exercisesList.innerHTML = '';
        
        Object.entries(exercises).forEach(([name, data]) => {
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card';
            exerciseCard.innerHTML = `
                <div class="exercise-info">
                    <h3>${name}</h3>
                    <div class="last-modified">${this.formatDate(data.lastModified)}</div>
                </div>
                <div class="exercise-value">${data.value}</div>
            `;
            
            exerciseCard.addEventListener('click', () => {
                this.editExercise(name, data.value);
            });
            
            exercisesList.appendChild(exerciseCard);
        });
    }

    editExercise(exerciseName, currentValue) {
        this.currentExercise = exerciseName;
        document.getElementById('edit-exercise-name').textContent = exerciseName;
        document.getElementById('exercise-value').value = currentValue;
        this.showModal();
        
        // Focus and select input
        setTimeout(() => {
            const input = document.getElementById('exercise-value');
            input.focus();
            input.select();
        }, 100);
    }

    saveExercise() {
        const newValue = document.getElementById('exercise-value').value.trim();
        if (!newValue) return;

        const exercises = this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup];
        exercises[this.currentExercise] = {
            value: newValue,
            lastModified: new Date().toISOString()
        };

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

        this.data.profiles[this.currentProfile].exercises[this.currentMuscleGroup][exerciseName] = {
            value: exerciseValue,
            lastModified: new Date().toISOString()
        };

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