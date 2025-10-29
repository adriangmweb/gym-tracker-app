class GymTracker {
    constructor() {
        this.currentProfile = null;
        this.currentMuscleGroup = null;
        this.currentExercise = null;
        this.data = this.loadData();
        this.saveDebounceTimer = null;
        this.saveDebounceDelay = 300; // 300ms debounce for saves
        this.backupPrefix = 'gymTrackerBackup_';
        this.maxBackups = 3; // Keep last 3 backups
        this.init();
    }

    init() {
        this.initializeData();
        this.bindEvents();
        // Show loading briefly for smooth transition (200ms max)
        this.showScreen('loading');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.showScreen('main');
            });
        });
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
            if (!data) return {};
            
            const parsed = JSON.parse(data);
            
            // Validate data structure integrity
            if (!this.validateDataStructure(parsed)) {
                console.warn('Data structure invalid, attempting recovery...');
                const recovered = this.attemptDataRecovery();
                if (recovered) {
                    // Delay notification until DOM is ready
                    setTimeout(() => {
                        this.showNotification('Data recovered from backup', 'success');
                    }, 100);
                    return recovered;
                }
                // If recovery fails, return empty and let initializeData handle it
                return {};
            }
            
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
            // Attempt recovery from backups
            const recovered = this.attemptDataRecovery();
            if (recovered) {
                // Delay notification until DOM is ready
                setTimeout(() => {
                    this.showNotification('Data recovered from backup after corruption', 'success');
                }, 100);
                return recovered;
            }
            return {};
        }
    }

    saveData() {
        // Clear existing debounce timer
        clearTimeout(this.saveDebounceTimer);
        
        // Set new timer for debounced save
        this.saveDebounceTimer = setTimeout(() => {
            this.performSave();
        }, this.saveDebounceDelay);
    }

    performSave() {
        try {
            const dataString = JSON.stringify(this.data);
            const sizeInMB = new Blob([dataString]).size / (1024 * 1024);
            
            // Warn if approaching localStorage limit (80% of typical 5MB limit)
            if (sizeInMB > 4) {
                console.warn(`Storage usage: ${sizeInMB.toFixed(2)}MB`);
                this.showNotification(`Storage usage high: ${sizeInMB.toFixed(2)}MB. Consider archiving old history.`, 'warning');
            }
            
            // Create backup before saving
            this.createBackup();
            
            localStorage.setItem('gymTrackerData', dataString);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded');
                this.handleQuotaExceeded();
            } else {
                console.error('Error saving data:', error);
                this.showNotification('Failed to save data. Please try again.', 'error');
            }
        }
    }

    validateDataStructure(data) {
        if (!data || typeof data !== 'object') return false;
        
        // Check if profiles exist and are valid
        if (data.profiles && typeof data.profiles === 'object') {
            for (const [key, profile] of Object.entries(data.profiles)) {
                if (!profile.name || !profile.exercises) return false;
            }
        }
        
        return true;
    }

    attemptDataRecovery() {
        // Try to recover from most recent backup
        for (let i = this.maxBackups; i >= 1; i--) {
            try {
                const backupKey = `${this.backupPrefix}${i}`;
                const backupData = localStorage.getItem(backupKey);
                if (backupData) {
                    const parsed = JSON.parse(backupData);
                    if (this.validateDataStructure(parsed)) {
                        console.log(`Recovered from backup ${i}`);
                        return parsed;
                    }
                }
            } catch (error) {
                console.warn(`Backup ${i} corrupted, trying next...`);
                continue;
            }
        }
        return null;
    }

    createBackup() {
        try {
            const currentData = localStorage.getItem('gymTrackerData');
            if (!currentData) return;
            
            // Shift existing backups (keep only last 3)
            for (let i = this.maxBackups; i > 1; i--) {
                const oldKey = `${this.backupPrefix}${i - 1}`;
                const newKey = `${this.backupPrefix}${i}`;
                const oldData = localStorage.getItem(oldKey);
                if (oldData) {
                    localStorage.setItem(newKey, oldData);
                } else {
                    localStorage.removeItem(newKey);
                }
            }
            
            // Create new backup
            localStorage.setItem(`${this.backupPrefix}1`, currentData);
        } catch (error) {
            console.warn('Failed to create backup:', error);
            // Don't throw - backup failure shouldn't prevent saving
        }
    }

    handleQuotaExceeded() {
        this.showNotification('Storage full! Consider archiving old exercise history.', 'error');
        // Offer to compress/archive old history entries
        // For now, just alert - could implement archiving UI later
    }

    showNotification(message, type = 'info') {
        // Ensure DOM is ready
        if (!document.body) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }
        
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create temporary notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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

        // Settings navigation
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showScreen('settings');
        });

        document.getElementById('back-to-main-settings').addEventListener('click', () => {
            this.showScreen('main');
        });

        // Export/Import functionality
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data-btn').addEventListener('click', () => {
            this.showImportModal();
        });

        document.getElementById('cancel-import').addEventListener('click', () => {
            this.hideImportModal();
        });

        document.getElementById('select-file-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importFromFile(e.target.files[0]);
        });

        document.getElementById('clipboard-import-btn').addEventListener('click', () => {
            this.importFromClipboard();
        });

        document.getElementById('close-import-result').addEventListener('click', () => {
            this.hideImportResultModal();
        });

        // Close import modal on backdrop click
        document.getElementById('import-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideImportModal();
            }
        });

        document.getElementById('import-result-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideImportResultModal();
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

    // Backup & Import functionality
    async exportData() {
        try {
            // Create export data structure according to specs
            const exportData = {
                exportDate: new Date().toISOString(),
                version: "1.0",
                users: {}
            };

            // Ensure we have data to export
            if (!this.data.profiles || Object.keys(this.data.profiles).length === 0) {
                alert('No data to export. Please add some exercises first.');
                return;
            }

            // Convert internal data structure to export format
            Object.entries(this.data.profiles).forEach(([profileKey, profile]) => {
                const userName = profile.name;
                exportData.users[userName] = {};
                
                if (profile.exercises) {
                    Object.entries(profile.exercises).forEach(([muscleGroup, exercises]) => {
                        const muscleGroupName = this.data.muscleGroupNames ? 
                            this.data.muscleGroupNames[muscleGroup] : this.capitalize(muscleGroup);
                        
                        exportData.users[userName][muscleGroupName] = {};
                        
                        Object.entries(exercises).forEach(([exerciseName, exerciseData]) => {
                            const currentValue = this.getCurrentValue(exerciseData);
                            const lastModified = exerciseData.history && exerciseData.history.length > 0 ? 
                                exerciseData.history[0].date : new Date().toISOString();
                            
                            exportData.users[userName][muscleGroupName][exerciseName] = {
                                value: currentValue,
                                lastModified: lastModified,
                                history: exerciseData.history || []
                            };
                        });
                    });
                }
            });

            const jsonString = JSON.stringify(exportData, null, 2);
            const fileName = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;

            console.log('Export data prepared:', exportData);

            // Try Web Share API first (for mobile) - with better error handling
            if (navigator.share && navigator.canShare) {
                try {
                    const file = new File([jsonString], fileName, { type: 'application/json' });
                    
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: 'Gym Tracker Backup',
                            text: 'Export of your gym exercise data'
                        });
                        return;
                    }
                } catch (shareError) {
                    console.log('Web Share API failed, falling back to download:', shareError);
                    // Continue to fallback download
                }
            }

            // Fallback: Direct download
            try {
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                alert('Backup created successfully!');
            } catch (downloadError) {
                console.error('Download fallback failed:', downloadError);
                // Last resort: copy to clipboard
                try {
                    await navigator.clipboard.writeText(jsonString);
                    alert('Export failed to download. Backup data has been copied to your clipboard instead. You can paste it into a text file and save it manually.');
                } catch (clipboardError) {
                    console.error('Clipboard fallback failed:', clipboardError);
                    alert('Export failed. Please try again or contact support.');
                }
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to create backup. Please try again.');
        }
    }

    showImportModal() {
        document.getElementById('import-modal').classList.remove('hidden');
    }

    hideImportModal() {
        document.getElementById('import-modal').classList.add('hidden');
        // Reset file input
        document.getElementById('import-file').value = '';
    }

    showImportResultModal() {
        document.getElementById('import-result-modal').classList.remove('hidden');
    }

    hideImportResultModal() {
        document.getElementById('import-result-modal').classList.add('hidden');
        this.hideImportModal();
    }

    async importFromFile(file) {
        if (!file) return;
        
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            this.processImportData(importData);
        } catch (error) {
            console.error('File import error:', error);
            alert('Invalid backup file. Please check the file format and try again.');
        }
    }

    async importFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const importData = JSON.parse(text);
            this.processImportData(importData);
        } catch (error) {
            console.error('Clipboard import error:', error);
            alert('Invalid JSON data in clipboard. Please copy a valid backup and try again.');
        }
    }

    processImportData(importData) {
        // Validate import data structure
        if (!this.validateImportData(importData)) {
            alert('Invalid backup data format. Please check your backup file.');
            return;
        }

        const mergeResult = this.mergeImportData(importData);
        this.saveData();
        this.showImportSummary(mergeResult);
        this.renderExercises(); // Refresh current view if needed
    }

    validateImportData(importData) {
        try {
            // Check required fields
            if (!importData.users || typeof importData.users !== 'object') {
                return false;
            }

            // Validate structure
            for (const [userName, userData] of Object.entries(importData.users)) {
                if (typeof userData !== 'object') return false;
                
                for (const [muscleGroup, exercises] of Object.entries(userData)) {
                    if (typeof exercises !== 'object') return false;
                    
                    for (const [exerciseName, exerciseData] of Object.entries(exercises)) {
                        if (!exerciseData.value || !exerciseData.lastModified) {
                            return false;
                        }
                    }
                }
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }

    mergeImportData(importData) {
        const result = {
            added: 0,
            updated: 0,
            unchanged: 0
        };

        // Convert import data back to internal format
        Object.entries(importData.users).forEach(([userName, userData]) => {
            // Find matching profile by name
            let profileKey = null;
            Object.entries(this.data.profiles).forEach(([key, profile]) => {
                if (profile.name === userName) {
                    profileKey = key;
                }
            });

            if (!profileKey) {
                // Create new profile if it doesn't exist
                profileKey = userName.toLowerCase();
                this.data.profiles[profileKey] = {
                    name: userName,
                    exercises: {}
                };
            }

            Object.entries(userData).forEach(([muscleGroupName, exercises]) => {
                // Find matching muscle group key
                let muscleGroupKey = null;
                Object.entries(this.data.muscleGroupNames || {}).forEach(([key, name]) => {
                    if (name === muscleGroupName) {
                        muscleGroupKey = key;
                    }
                });

                // Fallback: use lowercase version of muscle group name
                if (!muscleGroupKey) {
                    muscleGroupKey = muscleGroupName.toLowerCase();
                    if (!this.data.muscleGroupNames) {
                        this.data.muscleGroupNames = {};
                    }
                    this.data.muscleGroupNames[muscleGroupKey] = muscleGroupName;
                }

                if (!this.data.profiles[profileKey].exercises[muscleGroupKey]) {
                    this.data.profiles[profileKey].exercises[muscleGroupKey] = {};
                }

                Object.entries(exercises).forEach(([exerciseName, exerciseData]) => {
                    const existingExercise = this.data.profiles[profileKey].exercises[muscleGroupKey][exerciseName];
                    
                    if (!existingExercise) {
                        // New exercise
                        this.data.profiles[profileKey].exercises[muscleGroupKey][exerciseName] = {
                            history: exerciseData.history || [{
                                value: exerciseData.value,
                                date: exerciseData.lastModified
                            }]
                        };
                        result.added++;
                    } else {
                        // Existing exercise - merge with smart strategy
                        const currentValue = this.getCurrentValue(existingExercise);
                        const importValue = exerciseData.value;
                        
                        // Compare weights (extract numbers for comparison)
                        const currentWeight = parseFloat(currentValue.replace(/[^\d.]/g, '')) || 0;
                        const importWeight = parseFloat(importValue.replace(/[^\d.]/g, '')) || 0;
                        
                        if (importWeight > currentWeight) {
                            // Import has higher weight - add to history
                            const newEntry = {
                                value: importValue,
                                date: exerciseData.lastModified
                            };
                            existingExercise.history.unshift(newEntry);
                            result.updated++;
                        } else {
                            result.unchanged++;
                        }
                    }
                });
            });
        });

        return result;
    }

    showImportSummary(result) {
        const summaryElement = document.getElementById('import-summary');
        summaryElement.innerHTML = `
            <div class="import-summary-item">
                <span class="import-summary-icon">✅</span>
                <span>Added ${result.added} new exercises</span>
            </div>
            <div class="import-summary-item">
                <span class="import-summary-icon">✅</span>
                <span>Updated ${result.updated} exercises with higher weights</span>
            </div>
            <div class="import-summary-item">
                <span class="import-summary-icon">ℹ️</span>
                <span>Kept ${result.unchanged} existing exercises unchanged</span>
            </div>
        `;
        this.showImportResultModal();
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
    window.gymTracker = new GymTracker();
});

// Register service worker with update handling
if ('serviceWorker' in navigator) {
    let refreshing = false;
    
    // Handle service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        // Reload page when new service worker takes control
        window.location.reload();
    });
    
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
                
                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 3600000);
                
                // Listen for update found
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available - show update notification
                                const tracker = window.gymTracker;
                                if (tracker && tracker.showNotification) {
                                    tracker.showNotification('New version available! Reload to update.', 'info');
                                }
                            }
                        });
                    }
                });
            })
            .catch(registrationError => {
                console.error('Service Worker registration failed:', registrationError);
            });
    });
}

// Offline/Online detection
window.addEventListener('online', () => {
    const tracker = window.gymTracker;
    if (tracker && tracker.showNotification) {
        tracker.showNotification('Back online', 'success');
    }
});

window.addEventListener('offline', () => {
    const tracker = window.gymTracker;
    if (tracker && tracker.showNotification) {
        tracker.showNotification('Working offline', 'info');
    }
});
});
