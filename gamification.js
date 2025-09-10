// Gamification System for MindWell - Positive Reinforcement Platform
// The opposite of harmful challenges - this promotes growth, healing, and wellness

class GamificationSystem {
    constructor() {
        this.storage = new MindWellStorage();
        this.userLevel = 1;
        this.totalXP = 0;
        this.badges = [];
        this.achievements = [];
        this.streaks = {};
        this.virtualGarden = {
            plants: [],
            happiness: 0,
            growth: 0
        };
        
        this.init();
    }

    init() {
        this.loadUserProgress();
        this.setupLevelSystem();
        this.initializeAchievements();
        this.createVirtualGarden();
        this.setupEventListeners();
    }

    // Level System - Users grow and evolve
    setupLevelSystem() {
        this.levels = {
            1: { name: "Seedling", xpRequired: 0, reward: "Welcome to your journey!" },
            2: { name: "Sprout", xpRequired: 100, reward: "First steps taken!" },
            3: { name: "Sapling", xpRequired: 250, reward: "Growing stronger!" },
            4: { name: "Young Tree", xpRequired: 500, reward: "Building resilience!" },
            5: { name: "Flourishing Tree", xpRequired: 1000, reward: "Thriving mindfully!" },
            6: { name: "Wise Oak", xpRequired: 2000, reward: "Sharing wisdom!" },
            7: { name: "Guardian Tree", xpRequired: 4000, reward: "Protecting others!" },
            8: { name: "Ancient Wisdom", xpRequired: 8000, reward: "Master of wellness!" },
            9: { name: "Life Beacon", xpRequired: 15000, reward: "Inspiring many!" },
            10: { name: "Wellness Sage", xpRequired: 25000, reward: "Ultimate wisdom!" }
        };
    }

    // Positive Achievement System
    initializeAchievements() {
        this.achievementsList = [
            // Streak Achievements
            {
                id: 'first_day',
                name: '🌱 First Step',
                description: 'Complete your first daily task',
                category: 'milestones',
                xpReward: 50,
                unlocked: false,
                rarity: 'common'
            },
            {
                id: 'week_warrior',
                name: '🔥 Week Warrior',
                description: 'Maintain a 7-day streak',
                category: 'streaks',
                xpReward: 200,
                unlocked: false,
                rarity: 'rare'
            },
            {
                id: 'month_master',
                name: '👑 Month Master',
                description: 'Maintain a 30-day streak',
                category: 'streaks',
                xpReward: 1000,
                unlocked: false,
                rarity: 'legendary'
            },
            
            // Wellness Achievements
            {
                id: 'mood_tracker',
                name: '💙 Mood Tracker',
                description: 'Track your mood for 10 days',
                category: 'wellness',
                xpReward: 150,
                unlocked: false,
                rarity: 'common'
            },
            {
                id: 'assessment_master',
                name: '🧠 Assessment Master',
                description: 'Complete 3 mental health assessments',
                category: 'wellness',
                xpReward: 300,
                unlocked: false,
                rarity: 'uncommon'
            },
            {
                id: 'wellness_warrior',
                name: '🏆 Wellness Warrior',
                description: 'Complete 100 wellness tasks',
                category: 'wellness',
                xpReward: 500,
                unlocked: false,
                rarity: 'epic'
            },

            // Learning Achievements
            {
                id: 'knowledge_seeker',
                name: '📚 Knowledge Seeker',
                description: 'Complete 25 learning tasks',
                category: 'learning',
                xpReward: 250,
                unlocked: false,
                rarity: 'uncommon'
            },
            {
                id: 'brain_booster',
                name: '🚀 Brain Booster',
                description: 'Complete 10 cognitive tasks',
                category: 'learning',
                xpReward: 200,
                unlocked: false,
                rarity: 'common'
            },

            // Social Achievements  
            {
                id: 'friend_connector',
                name: '🤝 Friend Connector',
                description: 'Complete 5 social connection tasks',
                category: 'social',
                xpReward: 180,
                unlocked: false,
                rarity: 'common'
            },
            {
                id: 'community_helper',
                name: '❤️ Community Helper',
                description: 'Help others in the community',
                category: 'social',
                xpReward: 300,
                unlocked: false,
                rarity: 'rare'
            },

            // Special Achievements
            {
                id: 'gratitude_guru',
                name: '🙏 Gratitude Guru',
                description: 'Practice gratitude for 21 days',
                category: 'special',
                xpReward: 400,
                unlocked: false,
                rarity: 'epic'
            },
            {
                id: 'mindfulness_master',
                name: '🧘 Mindfulness Master',
                description: 'Complete 50 mindfulness activities',
                category: 'special',
                xpReward: 600,
                unlocked: false,
                rarity: 'legendary'
            },
            {
                id: 'life_changer',
                name: '🌟 Life Changer',
                description: 'Maintain excellent mental health for 3 months',
                category: 'special',
                xpReward: 2000,
                unlocked: false,
                rarity: 'mythic'
            }
        ];
    }

    // Virtual Garden System - Grows with positive actions
    createVirtualGarden() {
        this.gardenElements = [
            {
                id: 'hope_flower',
                name: '🌸 Hope Flower',
                unlockCondition: 'complete_first_task',
                growthStages: ['🌱', '🌿', '🌸', '🌺'],
                currentStage: 0,
                happiness: 10
            },
            {
                id: 'strength_tree',
                name: '🌳 Strength Tree',
                unlockCondition: 'week_streak',
                growthStages: ['🌱', '🌿', '🌳', '🌲'],
                currentStage: 0,
                happiness: 25
            },
            {
                id: 'wisdom_oak',
                name: '🍃 Wisdom Oak',
                unlockCondition: 'learning_tasks_10',
                growthStages: ['🌰', '🌿', '🍃', '🌳'],
                currentStage: 0,
                happiness: 30
            },
            {
                id: 'peace_lotus',
                name: '🪷 Peace Lotus',
                unlockCondition: 'mindfulness_tasks_5',
                growthStages: ['🌱', '🍀', '🪷', '🌺'],
                currentStage: 0,
                happiness: 20
            },
            {
                id: 'joy_sunflower',
                name: '🌻 Joy Sunflower',
                unlockCondition: 'good_mood_streak_7',
                growthStages: ['🌱', '🌿', '🌻', '🌞'],
                currentStage: 0,
                happiness: 35
            }
        ];
    }

    // Reward positive actions with XP and achievements
    addExperience(action, amount, context = {}) {
        this.totalXP += amount;
        
        // Check for level up
        this.checkLevelUp();
        
        // Check for achievements
        this.checkAchievements(action, context);
        
        // Update garden
        this.updateGarden(action, context);
        
        // Save progress
        this.saveProgress();
        
        // Show celebration
        this.showRewardNotification(action, amount);
    }

    // Positive reinforcement notifications
    showRewardNotification(action, xpGained) {
        const messages = {
            'complete_task': [
                '🎉 Amazing! You completed a wellness task!',
                '✨ You\'re building healthy habits!',
                '🌟 Every step counts towards your wellbeing!',
                '💪 You\'re getting stronger mentally!'
            ],
            'mood_track': [
                '💙 Thank you for checking in with yourself!',
                '🎯 Self-awareness is the first step to growth!',
                '📊 Your emotional intelligence is growing!'
            ],
            'assessment_complete': [
                '🧠 Brave of you to assess your mental health!',
                '📈 Knowledge is power - you\'re empowered!',
                '🔬 Understanding yourself better each day!'
            ],
            'streak_maintained': [
                '🔥 Your consistency is inspiring!',
                '💎 You\'re building diamond-strong habits!',
                '🚀 Your dedication is paying off!'
            ]
        };

        const actionMessages = messages[action] || ['🎉 Great job on your wellness journey!'];
        const randomMessage = actionMessages[Math.floor(Math.random() * actionMessages.length)];
        
        this.showCelebration(randomMessage, xpGained);
    }

    showCelebration(message, xpGained) {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-notification';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎊</div>
                <div class="celebration-message">${message}</div>
                <div class="celebration-xp">+${xpGained} XP</div>
                <div class="celebration-level">Level ${this.userLevel} - ${this.getCurrentLevelName()}</div>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        // Animate celebration
        setTimeout(() => {
            celebration.classList.add('celebration-show');
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            celebration.classList.add('celebration-hide');
            setTimeout(() => {
                if (document.body.contains(celebration)) {
                    document.body.removeChild(celebration);
                }
            }, 500);
        }, 3000);
    }

    // Check for level progression
    checkLevelUp() {
        const newLevel = this.calculateLevel(this.totalXP);
        if (newLevel > this.userLevel) {
            const oldLevel = this.userLevel;
            this.userLevel = newLevel;
            this.showLevelUpCelebration(oldLevel, newLevel);
        }
    }

    calculateLevel(xp) {
        let level = 1;
        for (let i = 10; i >= 1; i--) {
            if (xp >= this.levels[i].xpRequired) {
                level = i;
                break;
            }
        }
        return level;
    }

    showLevelUpCelebration(oldLevel, newLevel) {
        const levelData = this.levels[newLevel];
        const celebration = document.createElement('div');
        celebration.className = 'level-up-modal';
        celebration.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-animation">
                    <div class="level-up-icon">🎊✨🎉</div>
                    <h2>LEVEL UP!</h2>
                    <div class="level-progression">
                        <span class="old-level">${this.levels[oldLevel].name}</span>
                        <div class="level-arrow">➜</div>
                        <span class="new-level">${levelData.name}</span>
                    </div>
                    <div class="level-reward">
                        <h3>🎁 Achievement Unlocked!</h3>
                        <p>${levelData.reward}</p>
                    </div>
                    <div class="level-progress">
                        <div class="progress-text">Level ${newLevel}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                        Continue Journey 🚀
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(celebration);
        setTimeout(() => celebration.classList.add('show'), 100);
    }

    // Achievement checking system
    checkAchievements(action, context) {
        const data = this.storage.getData();
        
        this.achievementsList.forEach(achievement => {
            if (achievement.unlocked) return;
            
            let shouldUnlock = false;
            
            switch (achievement.id) {
                case 'first_day':
                    shouldUnlock = data.tasksCompleted >= 1;
                    break;
                case 'week_warrior':
                    shouldUnlock = data.streak >= 7;
                    break;
                case 'month_master':
                    shouldUnlock = data.streak >= 30;
                    break;
                case 'mood_tracker':
                    shouldUnlock = data.moodEntries.length >= 10;
                    break;
                case 'assessment_master':
                    shouldUnlock = data.assessments.length >= 3;
                    break;
                case 'wellness_warrior':
                    shouldUnlock = data.tasksCompleted >= 100;
                    break;
                case 'knowledge_seeker':
                    const learningTasks = data.dailyTasks.filter(t => t.category === 'learning' && t.completed);
                    shouldUnlock = learningTasks.length >= 25;
                    break;
                case 'brain_booster':
                    const cognitiveTasks = data.dailyTasks.filter(t => t.category === 'cognitive' && t.completed);
                    shouldUnlock = cognitiveTasks.length >= 10;
                    break;
                case 'friend_connector':
                    const socialTasks = data.dailyTasks.filter(t => t.category === 'social' && t.completed);
                    shouldUnlock = socialTasks.length >= 5;
                    break;
                case 'gratitude_guru':
                    const gratitudeTasks = data.dailyTasks.filter(t => 
                        t.completed && t.title && t.title.toLowerCase().includes('gratitude')
                    );
                    shouldUnlock = gratitudeTasks.length >= 21;
                    break;
                case 'mindfulness_master':
                    const mindfulnessTasks = data.dailyTasks.filter(t => t.category === 'mindfulness' && t.completed);
                    shouldUnlock = mindfulnessTasks.length >= 50;
                    break;
                case 'life_changer':
                    // Check for consistent good mental health (score > 70) for 90 days
                    const recentAssessments = data.assessments.filter(a => {
                        const assessmentDate = new Date(a.date);
                        const threeMonthsAgo = new Date();
                        threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
                        return assessmentDate >= threeMonthsAgo && a.score >= 70;
                    });
                    shouldUnlock = recentAssessments.length >= 12; // Weekly assessments for 3 months
                    break;
            }
            
            if (shouldUnlock) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.addExperienceQuiet(achievement.xpReward); // Add XP without triggering new checks
        
        // Show achievement notification
        this.showAchievementUnlock(achievement);
        
        // Save progress
        this.saveProgress();
    }

    showAchievementUnlock(achievement) {
        const rarityColors = {
            common: '#22c55e',
            uncommon: '#3b82f6', 
            rare: '#8b5cf6',
            epic: '#f59e0b',
            legendary: '#ef4444',
            mythic: '#ec4899'
        };
        
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content" style="border-color: ${rarityColors[achievement.rarity]}">
                <div class="achievement-glow" style="background: ${rarityColors[achievement.rarity]}20"></div>
                <div class="achievement-header">
                    <div class="achievement-rarity ${achievement.rarity}">${achievement.rarity.toUpperCase()}</div>
                    <div class="achievement-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</div>
                </div>
                <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
                <div class="achievement-name">${achievement.name.split(' ').slice(1).join(' ')}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-reward">+${achievement.xpReward} XP</div>
                <div class="achievement-celebration">🎉 Achievement Unlocked! 🎉</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('hide');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
    }

    // Garden growth system
    updateGarden(action, context) {
        this.gardenElements.forEach(element => {
            let shouldGrow = false;
            
            switch (element.unlockCondition) {
                case 'complete_first_task':
                    shouldGrow = this.storage.getData().tasksCompleted >= 1;
                    break;
                case 'week_streak':
                    shouldGrow = this.storage.getData().streak >= 7;
                    break;
                case 'learning_tasks_10':
                    const learningTasks = this.storage.getData().dailyTasks.filter(t => 
                        t.category === 'learning' && t.completed
                    );
                    shouldGrow = learningTasks.length >= 10;
                    break;
                case 'mindfulness_tasks_5':
                    const mindfulnessTasks = this.storage.getData().dailyTasks.filter(t => 
                        t.category === 'mindfulness' && t.completed
                    );
                    shouldGrow = mindfulnessTasks.length >= 5;
                    break;
                case 'good_mood_streak_7':
                    const recentMoods = this.storage.getData().moodEntries.slice(-7);
                    const goodMoods = recentMoods.filter(m => m.value >= 4);
                    shouldGrow = goodMoods.length >= 7;
                    break;
            }
            
            if (shouldGrow && element.currentStage < element.growthStages.length - 1) {
                element.currentStage++;
                this.virtualGarden.happiness += element.happiness;
                this.showGardenGrowth(element);
            }
        });
    }

    showGardenGrowth(element) {
        const notification = document.createElement('div');
        notification.className = 'garden-growth-notification';
        notification.innerHTML = `
            <div class="garden-growth-content">
                <div class="garden-growth-icon">${element.growthStages[element.currentStage]}</div>
                <div class="garden-growth-message">
                    Your ${element.name} is growing!
                </div>
                <div class="garden-happiness">+${element.happiness} Garden Happiness</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 3000);
    }

    // Progress tracking and saving
    addExperienceQuiet(amount) {
        this.totalXP += amount;
        this.saveProgress();
    }

    saveProgress() {
        const progressData = {
            userLevel: this.userLevel,
            totalXP: this.totalXP,
            achievements: this.achievementsList.filter(a => a.unlocked),
            virtualGarden: this.virtualGarden,
            gardenElements: this.gardenElements,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('mindwell_gamification', JSON.stringify(progressData));
    }

    loadUserProgress() {
        const saved = localStorage.getItem('mindwell_gamification');
        if (saved) {
            const data = JSON.parse(saved);
            this.userLevel = data.userLevel || 1;
            this.totalXP = data.totalXP || 0;
            this.virtualGarden = data.virtualGarden || this.virtualGarden;
            
            if (data.achievements) {
                data.achievements.forEach(savedAchievement => {
                    const achievement = this.achievementsList.find(a => a.id === savedAchievement.id);
                    if (achievement) {
                        achievement.unlocked = true;
                    }
                });
            }
            
            if (data.gardenElements) {
                this.gardenElements = data.gardenElements;
            }
        }
    }

    getCurrentLevelName() {
        return this.levels[this.userLevel]?.name || 'Seedling';
    }

    getProgressToNextLevel() {
        const currentLevelXP = this.levels[this.userLevel]?.xpRequired || 0;
        const nextLevelXP = this.levels[this.userLevel + 1]?.xpRequired || this.totalXP;
        const progress = ((this.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    setupEventListeners() {
        // Listen for user actions to award XP
        document.addEventListener('taskCompleted', (e) => {
            this.addExperience('complete_task', 25, e.detail);
        });
        
        document.addEventListener('moodTracked', (e) => {
            this.addExperience('mood_track', 15, e.detail);
        });
        
        document.addEventListener('assessmentCompleted', (e) => {
            this.addExperience('assessment_complete', 50, e.detail);
        });
        
        document.addEventListener('streakMaintained', (e) => {
            const bonusXP = Math.min(e.detail.streakDays * 5, 100);
            this.addExperience('streak_maintained', bonusXP, e.detail);
        });
    }

    // Public methods for integration
    displayProgressWidget() {
        return {
            level: this.userLevel,
            levelName: this.getCurrentLevelName(),
            xp: this.totalXP,
            progressPercent: this.getProgressToNextLevel(),
            unlockedAchievements: this.achievementsList.filter(a => a.unlocked).length,
            totalAchievements: this.achievementsList.length,
            gardenHappiness: this.virtualGarden.happiness
        };
    }

    getMotivationalMessage() {
        const messages = [
            "🌟 You're building something beautiful - your mental wellness!",
            "💪 Every small step is a victory worth celebrating!",
            "🌱 Like a garden, your mind grows stronger with daily care!",
            "✨ Your commitment to self-care is inspiring!",
            "🎯 Progress, not perfection - you're doing amazing!",
            "🌈 Each day you choose wellness, you choose life!",
            "🚀 Your journey matters, and you're not walking it alone!",
            "💙 Taking care of your mental health is the bravest thing you can do!"
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Initialize gamification system
document.addEventListener('DOMContentLoaded', () => {
    if (!window.gamificationSystem) {
        window.gamificationSystem = new GamificationSystem();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
