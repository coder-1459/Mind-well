// MindWell - Mental Health Tracker JavaScript

// Data Storage and Management
class MindWellStorage {
    constructor() {
        this.storageKey = 'mindwell_data';
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            user: {
                name: '',
                registrationDate: new Date().toISOString(),
                mentalHealthScore: null,
                lastAssessmentDate: null
            },
            assessments: [],
            dailyTasks: [],
            moodEntries: [],
            appointments: [],
            streak: 0,
            tasksCompleted: 0,
            settings: {
                notifications: true,
                theme: 'light'
            }
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    updateUser(userData) {
        this.data.user = { ...this.data.user, ...userData };
        this.saveData();
    }

    addAssessment(assessment) {
        this.data.assessments.push({
            id: Date.now(),
            date: new Date().toISOString(),
            ...assessment
        });
        this.data.user.mentalHealthScore = assessment.score;
        this.data.user.lastAssessmentDate = new Date().toISOString();
        this.saveData();
    }

    addMoodEntry(mood) {
        const today = new Date().toDateString();
        const existingIndex = this.data.moodEntries.findIndex(entry => 
            new Date(entry.date).toDateString() === today
        );
        
        if (existingIndex !== -1) {
            this.data.moodEntries[existingIndex] = {
                id: this.data.moodEntries[existingIndex].id,
                date: new Date().toISOString(),
                ...mood
            };
        } else {
            this.data.moodEntries.push({
                id: Date.now(),
                date: new Date().toISOString(),
                ...mood
            });
        }
        this.saveData();
    }

    addTask(task) {
        this.data.dailyTasks.push({
            id: Date.now(),
            date: new Date().toISOString(),
            deadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours from now
            completed: false,
            ...task
        });
        this.saveData();
    }

    completeTask(taskId) {
        const task = this.data.dailyTasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.completed = true;
            task.completedAt = new Date().toISOString();
            this.data.tasksCompleted++;
            this.updateStreak();
            this.saveData();
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        const todayTasks = this.data.dailyTasks.filter(task => 
            new Date(task.date).toDateString() === today && task.completed
        );

        const yesterdayTasks = this.data.dailyTasks.filter(task => 
            new Date(task.date).toDateString() === yesterday && task.completed
        );

        if (todayTasks.length > 0) {
            if (yesterdayTasks.length > 0 || this.data.streak === 0) {
                this.data.streak++;
            }
        } else {
            // Check if streak should be maintained (grace period logic could be added here)
        }
    }

    addAppointment(appointment) {
        this.data.appointments.push({
            id: Date.now(),
            bookingDate: new Date().toISOString(),
            ...appointment
        });
        this.saveData();
    }

    getData() {
        return this.data;
    }
}

// Initialize storage
const storage = new MindWellStorage();

// Theme Manager Class
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem('mindwell_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else if (systemPrefersDark) {
            this.currentTheme = 'dark';
        }
        
        this.applyTheme();
        this.setupToggleButton();
        this.watchSystemTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateToggleIcon();
        localStorage.setItem('mindwell_theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        // Update 3D scene colors if they exist
        this.update3DColors();
    }

    updateToggleIcon() {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            if (this.currentTheme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeIcon.style.color = '#f59e0b'; // Sun color
            } else {
                themeIcon.className = 'fas fa-moon';
                themeIcon.style.color = '#6366f1'; // Moon color
            }
        }
    }

    setupToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleTheme();
                
                // Add click animation
                toggleBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    toggleBtn.style.transform = '';
                }, 150);
            });
        }
    }

    watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('mindwell_theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }

    update3DColors() {
        // Update 3D scene colors when theme changes
        if (window.mindWell3DManager && window.mindWell3DManager.scenes) {
            const newColors = this.currentTheme === 'dark' ? {
                primary: 0x8b5cf6,     // Lighter purple for dark mode
                secondary: 0x34d399,   // Lighter green for dark mode
                accent: 0xfbbf24,      // Lighter yellow for dark mode
                background: 0x111827,
                light: 0x4f46e5
            } : {
                primary: 0x6366f1,
                secondary: 0x10b981,
                accent: 0xf59e0b,
                background: 0xffffff,
                light: 0xe0f2fe
            };
            
            // Update colors for each scene
            Object.values(window.mindWell3DManager.scenes).forEach(scene => {
                if (scene && scene.colors) {
                    scene.colors = newColors;
                }
            });
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Set active navigation item
        this.setActiveNav();
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
    }

    setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// Mental Health Assessment Calculator
class MentalHealthAssessment {
    constructor() {
        this.questions = [
            {
                id: 1,
                category: 'mood',
                question: 'How often have you felt down, depressed, or hopeless in the past two weeks?',
                options: [
                    { text: 'Not at all', value: 0 },
                    { text: 'Several days', value: 1 },
                    { text: 'More than half the days', value: 2 },
                    { text: 'Nearly every day', value: 3 }
                ]
            },
            {
                id: 2,
                category: 'mood',
                question: 'How often have you had little interest or pleasure in doing things?',
                options: [
                    { text: 'Not at all', value: 0 },
                    { text: 'Several days', value: 1 },
                    { text: 'More than half the days', value: 2 },
                    { text: 'Nearly every day', value: 3 }
                ]
            },
            {
                id: 3,
                category: 'anxiety',
                question: 'How often have you felt nervous, anxious, or on edge?',
                options: [
                    { text: 'Not at all', value: 0 },
                    { text: 'Several days', value: 1 },
                    { text: 'More than half the days', value: 2 },
                    { text: 'Nearly every day', value: 3 }
                ]
            },
            {
                id: 4,
                category: 'anxiety',
                question: 'How often have you been unable to stop or control worrying?',
                options: [
                    { text: 'Not at all', value: 0 },
                    { text: 'Several days', value: 1 },
                    { text: 'More than half the days', value: 2 },
                    { text: 'Nearly every day', value: 3 }
                ]
            },
            {
                id: 5,
                category: 'stress',
                question: 'How would you rate your current stress level?',
                options: [
                    { text: 'Very low', value: 0 },
                    { text: 'Low', value: 1 },
                    { text: 'Moderate', value: 2 },
                    { text: 'High', value: 3 },
                    { text: 'Very high', value: 4 }
                ]
            },
            {
                id: 6,
                category: 'sleep',
                question: 'How is your sleep quality recently?',
                options: [
                    { text: 'Excellent', value: 0 },
                    { text: 'Good', value: 1 },
                    { text: 'Fair', value: 2 },
                    { text: 'Poor', value: 3 },
                    { text: 'Very poor', value: 4 }
                ]
            },
            {
                id: 7,
                category: 'social',
                question: 'How connected do you feel to others around you?',
                options: [
                    { text: 'Very connected', value: 0 },
                    { text: 'Somewhat connected', value: 1 },
                    { text: 'Neutral', value: 2 },
                    { text: 'Somewhat isolated', value: 3 },
                    { text: 'Very isolated', value: 4 }
                ]
            },
            {
                id: 8,
                category: 'energy',
                question: 'How would you describe your energy levels?',
                options: [
                    { text: 'Very high', value: 0 },
                    { text: 'High', value: 1 },
                    { text: 'Moderate', value: 2 },
                    { text: 'Low', value: 3 },
                    { text: 'Very low', value: 4 }
                ]
            },
            {
                id: 9,
                category: 'coping',
                question: 'How well are you coping with daily challenges?',
                options: [
                    { text: 'Very well', value: 0 },
                    { text: 'Well', value: 1 },
                    { text: 'Okay', value: 2 },
                    { text: 'Poorly', value: 3 },
                    { text: 'Very poorly', value: 4 }
                ]
            },
            {
                id: 10,
                category: 'overall',
                question: 'Overall, how satisfied are you with your life currently?',
                options: [
                    { text: 'Very satisfied', value: 0 },
                    { text: 'Satisfied', value: 1 },
                    { text: 'Neutral', value: 2 },
                    { text: 'Dissatisfied', value: 3 },
                    { text: 'Very dissatisfied', value: 4 }
                ]
            }
        ];
    }

    calculateScore(answers) {
        const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
        const maxPossibleScore = this.questions.reduce((sum, q) => 
            sum + Math.max(...q.options.map(o => o.value)), 0
        );
        
        // Convert to percentage (higher percentage = better mental health)
        const percentage = Math.round((1 - (totalScore / maxPossibleScore)) * 100);
        
        return {
            score: percentage,
            totalScore,
            maxPossibleScore,
            interpretation: this.getInterpretation(percentage),
            categoryScores: this.calculateCategoryScores(answers)
        };
    }

    getInterpretation(percentage) {
        if (percentage >= 80) return 'Excellent mental health';
        if (percentage >= 60) return 'Good mental health';
        if (percentage >= 40) return 'Fair mental health - consider some improvements';
        if (percentage >= 20) return 'Poor mental health - seek support';
        return 'Very poor mental health - please seek professional help';
    }

    calculateCategoryScores(answers) {
        const categories = {};
        this.questions.forEach((question, index) => {
            const category = question.category;
            if (!categories[category]) {
                categories[category] = { total: 0, max: 0, count: 0 };
            }
            categories[category].total += answers[index].value;
            categories[category].max += Math.max(...question.options.map(o => o.value));
            categories[category].count++;
        });

        Object.keys(categories).forEach(category => {
            const cat = categories[category];
            categories[category].percentage = Math.round((1 - (cat.total / cat.max)) * 100);
        });

        return categories;
    }
}

// Daily Tasks Generator
class TaskGenerator {
    constructor() {
        this.tasks = [
            // Original cognitive tasks
            {
                category: 'cognitive',
                title: 'Brain Training Exercise',
                description: 'Complete a 15-minute puzzle or brain training game',
                duration: 15,
                difficulty: 'easy'
            },
            {
                category: 'cognitive',
                title: 'Challenge Your Mind',
                description: 'Solve a riddle, learn a fascinating fact, or reflect deeply for five minutes',
                duration: 10,
                difficulty: 'easy',
                wisdom: 'Small mental challenges build strong minds'
            },
            {
                category: 'cognitive',
                title: 'Math Challenge',
                description: 'Solve mathematical problems or equations for 20 minutes',
                duration: 20,
                difficulty: 'medium'
            },
            
            // Mindfulness and spiritual tasks
            {
                category: 'mindfulness',
                title: 'Morning Calm Ritual',
                description: 'Wake up before the noise begins and meet your calm with 10 minutes of silence',
                duration: 10,
                difficulty: 'easy',
                wisdom: 'Peace begins in the quiet moments before the world awakens'
            },
            {
                category: 'mindfulness',
                title: 'Sacred Reading',
                description: 'Read something meaningful—sacred or inspiring—for just ten minutes',
                duration: 10,
                difficulty: 'easy',
                wisdom: 'Nourish your soul with words that uplift'
            },
            {
                category: 'mindfulness',
                title: 'Mindful Walking',
                description: 'Take a walk without your phone and bring yourself into the moment',
                duration: 20,
                difficulty: 'easy',
                wisdom: 'The present moment is your greatest teacher'
            },
            {
                category: 'mindfulness',
                title: 'Deep Breathing Practice',
                description: 'Breathe deeply—let your body and mind settle in silence for 10 minutes',
                duration: 10,
                difficulty: 'easy',
                wisdom: 'In every breath lies the power to reset your mind'
            },
            {
                category: 'mindfulness',
                title: 'Cultivate Stillness',
                description: 'Listen more than you speak today—practice mindful listening in conversations',
                duration: 30,
                difficulty: 'medium',
                wisdom: 'In silence, we find wisdom'
            },
            {
                category: 'mindfulness',
                title: 'Phone-Free Pause',
                description: 'Quiet the rush—pause and breathe before checking your phone for the first time',
                duration: 5,
                difficulty: 'easy',
                wisdom: 'Your peace is more valuable than your notifications'
            },
            
            // Creative and reflective tasks
            {
                category: 'creative',
                title: 'Nourish Your Thoughts',
                description: 'Write or reflect in a journal for 15 minutes about your inner world',
                duration: 15,
                difficulty: 'easy',
                wisdom: 'Your thoughts deserve care and attention'
            },
            {
                category: 'creative',
                title: 'Art Creation',
                description: 'Draw, paint, or create something artistic for 30 minutes',
                duration: 30,
                difficulty: 'medium'
            },
            
            // Physical wellness tasks
            {
                category: 'physical',
                title: 'Mindful Exercise',
                description: 'Do 20-30 minutes of physical exercise or yoga with full presence',
                duration: 25,
                difficulty: 'medium'
            },
            {
                category: 'physical',
                title: 'Hydration Mindfulness',
                description: 'Hydrate your mind—as you hydrate your body, consciously replenish your thoughts',
                duration: 5,
                difficulty: 'easy',
                wisdom: 'Care for your body, nurture your mind'
            },
            
            // Social connection tasks
            {
                category: 'social',
                title: 'Meaningful Connection',
                description: 'Connect with someone who matters—call or message a friend or family member',
                duration: 15,
                difficulty: 'easy',
                wisdom: 'Relationships are the foundation of happiness'
            },
            {
                category: 'social',
                title: 'Act of Purpose',
                description: 'Connect with purpose—do one small act that lifts someone else up',
                duration: 20,
                difficulty: 'medium',
                wisdom: 'Kindness multiplies when shared'
            },
            {
                category: 'social',
                title: 'Book Support Time',
                description: 'When things get heavy, book time with someone who cares—reach out for support',
                duration: 30,
                difficulty: 'medium',
                wisdom: 'Seeking help is a sign of strength, not weakness'
            },
            
            // Learning and growth tasks
            {
                category: 'learning',
                title: 'Learn Something New',
                description: 'Spend 30 minutes learning about a topic that interests you',
                duration: 30,
                difficulty: 'medium'
            },
            {
                category: 'learning',
                title: 'Read Educational Content',
                description: 'Read articles or books that expand your knowledge for 45 minutes',
                duration: 45,
                difficulty: 'hard'
            },
            
            // Gratitude and positivity tasks
            {
                category: 'mindfulness',
                title: 'Gratitude Grounding',
                description: 'Let gratitude ground your day—name three good things from your life this morning',
                duration: 5,
                difficulty: 'easy',
                wisdom: 'Gratitude turns what we have into enough'
            },
            {
                category: 'mindfulness',
                title: 'Small Win Celebration',
                description: 'Make one small win your first act today—celebrate consistency and progress',
                duration: 10,
                difficulty: 'easy',
                wisdom: 'Small steps build strong habits'
            },
            {
                category: 'mindfulness',
                title: 'Mood Awareness',
                description: 'Track your mood and emotions—awareness is the first step to any positive change',
                duration: 5,
                difficulty: 'easy',
                wisdom: 'Understanding yourself is the beginning of transformation'
            }
        ];
        
        // Bollywood Wisdom for Life Transformation
        this.bollywoodWisdom = [
            {
                rule: 'Gratitude over Comparison',
                description: 'Appreciate what you have instead of comparing with others',
                quote: 'Itni shiddat se maine tumhe paane ki koshish ki hai, ki har zarre ne mujse tumse milane ki saazish ki hai.',
                movie: 'Om Shanti Om',
                wisdom: 'The universe conspires to help those who truly appreciate what they seek'
            },
            {
                rule: 'Focus on What You Can Control',
                description: 'Don\'t waste energy on what\'s beyond your influence',
                quote: 'Haar ke jeetne wale ko hi Baazigar kehte hain.',
                movie: 'Baazigar',
                wisdom: 'True champions are those who rise after falling'
            },
            {
                rule: 'Reframe Problems as Opportunities',
                description: 'Every challenge is a teacher in disguise',
                quote: 'Zindagi mein kuch banna ho, kuch hasil karna ho, toh hamesha dil ki suno.',
                movie: '3 Idiots',
                wisdom: 'Follow your heart to find your true path'
            },
            {
                rule: 'Be Present, Not Past or Future Stuck',
                description: 'Value today, not regrets or future worries',
                quote: 'Kal ho na ho.',
                movie: 'Kal Ho Naa Ho',
                wisdom: 'Tomorrow may not come, so live fully today'
            },
            {
                rule: 'Progress, Not Perfection',
                description: 'Take small steps daily instead of seeking perfection',
                quote: 'All izz well.',
                movie: '3 Idiots',
                wisdom: 'When you believe all is well, you create space for solutions'
            },
            {
                rule: 'Seek Learning, Not Just Success',
                description: 'Failures are lessons, not endings',
                quote: 'Picture abhi baaki hai mere dost.',
                movie: 'Om Shanti Om',
                wisdom: 'Your story is still being written'
            },
            {
                rule: 'Kindness as a Strength',
                description: 'Be kind to yourself and others—it\'s a superpower',
                quote: 'Insaan ki asli pehchaan uske dukh mein hoti hai, sukh mein toh sab ache lagte hain.',
                movie: 'Munna Bhai MBBS',
                wisdom: 'True character is revealed in difficult times'
            }
        ];
    }

    generateDailyTasks(count = 3) {
        const shuffled = [...this.tasks].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    getRandomWisdom() {
        const randomIndex = Math.floor(Math.random() * this.bollywoodWisdom.length);
        return this.bollywoodWisdom[randomIndex];
    }

    getTodaysWisdom() {
        // Get consistent wisdom for the day based on date
        const today = new Date().toDateString();
        const hash = today.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const index = Math.abs(hash) % this.bollywoodWisdom.length;
        return this.bollywoodWisdom[index];
    }
}

// Utility Functions
class Utils {
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static timeAgo(date) {
        const now = new Date();
        const then = new Date(date);
        const diffMs = now - then;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '10000';
        notification.style.maxWidth = '300px';
        
        document.body.appendChild(notification);
        
        // Animate in
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
            notification.style.transition = 'all 0.3s ease';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    static updateProgress(elementId, percentage) {
        const element = document.getElementById(elementId);
        if (element) {
            const progressFill = element.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        }
    }
}

// Page-specific functionality
class HomePage {
    constructor() {
        this.init();
    }

    init() {
        this.updateQuickStats();
        this.animateElements();
    }

    updateQuickStats() {
        const data = storage.getData();
        
        // Update mental health score
        const scoreElement = document.getElementById('mentalHealthScore');
        if (scoreElement) {
            scoreElement.textContent = data.user.mentalHealthScore ? 
                `${data.user.mentalHealthScore}%` : '--';
        }

        // Update streak
        const streakElement = document.getElementById('streakDays');
        if (streakElement) {
            streakElement.textContent = data.streak;
        }

        // Update tasks completed
        const tasksElement = document.getElementById('tasksCompleted');
        if (tasksElement) {
            tasksElement.textContent = data.tasksCompleted;
        }

        // Update current mood
        const moodElement = document.getElementById('currentMood');
        if (moodElement) {
            const today = new Date().toDateString();
            const todayMood = data.moodEntries.find(entry => 
                new Date(entry.date).toDateString() === today
            );
            moodElement.textContent = todayMood ? todayMood.emoji : '--';
        }
    }

    animateElements() {
        const elements = document.querySelectorAll('.stat-card, .feature-card, .stat-box');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Sliding Animations Controller
class SlidingAnimations {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeElements();
        this.addScrollListener();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSlideAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    initializeElements() {
        // Feature cards with alternating slide directions
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.classList.add('slide-element');
            card.dataset.slideType = index % 2 === 0 ? 'slide-in-left' : 'slide-in-right';
            this.observer.observe(card);
        });

        // Wisdom tip cards with staggered animations
        document.querySelectorAll('.tip-card').forEach((card, index) => {
            card.classList.add('slide-element');
            card.dataset.slideType = `slide-stagger-${(index % 3) + 1}`;
            this.observer.observe(card);
        });

        // Stats boxes with bounce effect
        document.querySelectorAll('.stat-box').forEach((box, index) => {
            box.classList.add('slide-element');
            box.dataset.slideType = 'slide-bounce';
            box.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(box);
        });

        // Section titles with scale effect
        document.querySelectorAll('.section-title').forEach(title => {
            title.classList.add('slide-element');
            title.dataset.slideType = 'slide-scale';
            this.observer.observe(title);
        });

        // Stat cards in hero with elastic effect
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.classList.add('slide-element');
            card.dataset.slideType = 'slide-elastic';
            card.style.animationDelay = `${index * 0.2}s`;
            this.observer.observe(card);
        });
    }

    triggerSlideAnimation(element) {
        const slideType = element.dataset.slideType;
        if (slideType && !element.classList.contains('slide-animated')) {
            element.classList.add(slideType, 'slide-animated');
            element.style.opacity = '1';
            
            // Add floating effect to some elements after animation
            setTimeout(() => {
                if (element.classList.contains('tip-card')) {
                    element.classList.add('slide-float');
                }
            }, 1000);
        }
    }

    addScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const offset = scrollY * 0.5;
            heroContent.style.transform = `translateY(${offset}px)`;
        }
        
        // Add scroll-based animations
        document.querySelectorAll('.slide-element.slide-animated').forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible) {
                const progress = Math.min(1, (windowHeight - rect.top) / windowHeight);
                
                // Add subtle scroll-based transformations
                if (element.classList.contains('feature-card')) {
                    element.style.transform += ` rotateY(${progress * 2}deg)`;
                } else if (element.classList.contains('tip-card')) {
                    element.style.transform += ` scale(${0.95 + progress * 0.05})`;
                }
            }
        });
    }

    // Method to manually trigger animations
    animateElement(element, slideType = 'slide-in-up') {
        element.dataset.slideType = slideType;
        this.triggerSlideAnimation(element);
    }

    // Method to add continuous animations
    addContinuousAnimation(element, animationType = 'slide-float') {
        element.classList.add(animationType);
    }

    // Method to remove animations
    removeAnimation(element) {
        const animationClasses = [
            'slide-in-left', 'slide-in-right', 'slide-in-up', 'slide-in-down',
            'slide-scale', 'slide-rotate', 'slide-flip', 'slide-bounce',
            'slide-elastic', 'slide-stagger-1', 'slide-stagger-2', 'slide-stagger-3',
            'slide-float', 'slide-swing', 'slide-pulse', 'slide-glow'
        ];
        
        element.classList.remove(...animationClasses, 'slide-animated');
        element.style.opacity = '';
        element.style.transform = '';
        element.style.animationDelay = '';
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager first
    window.themeManager = new ThemeManager();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize sliding animations
    window.slidingAnimations = new SlidingAnimations();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            new HomePage();
            break;
        // Other pages will be handled when their files are created
    }
});

// Export classes for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MindWellStorage,
        Navigation,
        MentalHealthAssessment,
        TaskGenerator,
        Utils
    };
}
