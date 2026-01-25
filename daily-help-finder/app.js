// ===================================
// DAILY HELP FINDER APP
// Modular, expandable logic
// ===================================

class DailyHelpFinder {
    constructor() {
        this.questions = [];
        this.products = [];
        this.affiliates = [];
        this.leadMagnet = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.scores = {
            homework: 0,
            school: 0,
            autism: 0,
            adhd: 0,
            structure: 0,
            communication: 0,
            daily_life: 0,
            // NEW: Social Stories tags
            preparation: 0,
            medical: 0,
            development: 0,
            milestones: 0,
            transitions: 0,
            social: 0,
            anxiety: 0,
            life_skills: 0
        };
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.renderQuestion();
        this.updateProgress();
    }
    
    async loadData() {
        try {
            // Load questions
            const questionsResponse = await fetch('data/questions.json');
            const questionsData = await questionsResponse.json();
            this.questions = questionsData.questions;
            
            // Load products
            const productsResponse = await fetch('data/products.json');
            const productsData = await productsResponse.json();
            this.products = productsData.products;
            this.affiliates = productsData.affiliates || [];
            this.leadMagnet = productsData.lead_magnet;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    updateProgress() {
        const progressPercent = ((this.currentQuestionIndex) / this.questions.length) * 100;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Question ${this.currentQuestionIndex} of ${this.questions.length}`;
        }
    }
    
    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;
        
        const questionCard = document.getElementById('question-card');
        if (!questionCard) return;
        
        // Fade out
        questionCard.style.opacity = '0';
        
        setTimeout(() => {
            questionCard.innerHTML = `
                <div class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</div>
                <h2 class="question-text">${question.question}</h2>
                
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <div class="answer-option" data-value="${option.value}">
                            <input type="radio" 
                                   name="question-${question.id}" 
                                   id="option-${index}" 
                                   value="${option.value}">
                            <label for="option-${index}">${option.label}</label>
                        </div>
                    `).join('')}
                </div>
                
                <div id="insight-box" class="insight-box">
                    <div class="insight-item">
                        <div class="insight-label">💡 What Helped Us</div>
                        <div class="insight-text">${question.insight.helped_us}</div>
                    </div>
                    <div class="insight-item">
                        <div class="insight-label">🔬 What Science Says</div>
                        <div class="insight-text">${question.insight.science}</div>
                    </div>
                    ${question.insight.quick_tip ? `
                        <div class="insight-item">
                            <div class="insight-label">⚡ Quick Tip</div>
                            <div class="insight-text">${question.insight.quick_tip}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="button-group">
                    ${this.currentQuestionIndex > 0 ? `
                        <button class="btn btn-secondary" onclick="finder.previousQuestion()">
                            ← Back
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" id="next-btn" disabled>
                        ${this.currentQuestionIndex === this.questions.length - 1 ? 'Show Results →' : 'Next →'}
                    </button>
                </div>
            `;
            
            // Add event listeners
            const options = questionCard.querySelectorAll('.answer-option');
            options.forEach(option => {
                option.addEventListener('click', () => this.selectAnswer(option));
            });
            
            // Fade in
            setTimeout(() => {
                questionCard.style.opacity = '1';
            }, 50);
        }, 300);
    }
    
    selectAnswer(selectedOption) {
        const questionCard = document.getElementById('question-card');
        const options = questionCard.querySelectorAll('.answer-option');
        const nextBtn = document.getElementById('next-btn');
        
        // Remove selection from all options
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selection to clicked option
        selectedOption.classList.add('selected');
        const radio = selectedOption.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Enable next button
        nextBtn.disabled = false;
        
        // Save answer
        const question = this.questions[this.currentQuestionIndex];
        const value = selectedOption.dataset.value;
        const selectedOptionData = question.options.find(opt => opt.value === value);
        
        this.answers[question.id] = {
            value: value,
            score: selectedOptionData.score
        };
        
        // Update scores
        Object.keys(selectedOptionData.score).forEach(category => {
            if (this.scores.hasOwnProperty(category)) {
                this.scores[category] += selectedOptionData.score[category];
            }
        });
        
        // Show insight box with animation
        const insightBox = document.getElementById('insight-box');
        if (insightBox) {
            insightBox.classList.add('visible');
        }
        
        // Auto-advance logic (optional)
        nextBtn.onclick = () => this.nextQuestion();
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
            this.updateProgress();
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Show results
            this.showResults();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            
            // Remove answer from scores
            const question = this.questions[this.currentQuestionIndex];
            const answer = this.answers[question.id];
            if (answer) {
                Object.keys(answer.score).forEach(category => {
                    if (this.scores.hasOwnProperty(category)) {
                        this.scores[category] -= answer.score[category];
                    }
                });
                delete this.answers[question.id];
            }
            
            this.renderQuestion();
            this.updateProgress();
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    showResults() {
        // Hide questions container
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.style.display = 'none';
        
        // Show results container
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.style.display = 'block';
        
        // Get recommended products
        const recommendations = this.getRecommendations();
        
        // Render results
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h2>Your Personalized Recommendations</h2>
                <p>Based on your answers, these tools will help you most:</p>
            </div>
            
            <div class="score-summary">
                <h3>Your Challenge Areas</h3>
                <div class="score-items">
                    ${this.getTopChallenges().map(challenge => `
                        <div class="score-item">
                            <div class="score-label">${challenge.label}</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${challenge.percent}%"></div>
                            </div>
                            <div class="score-value">${challenge.score} points</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>🎯 Recommended for You</h3>
                ${recommendations.products.map((product, index) => this.renderProductCard(product, index + 1)).join('')}
            </div>
            
            ${recommendations.affiliates.length > 0 ? `
                <div class="affiliates-section">
                    <h3>💡 Also Helpful</h3>
                    <p class="section-note">Additional tools that support your goals:</p>
                    ${recommendations.affiliates.map(affiliate => this.renderAffiliateCard(affiliate)).join('')}
                </div>
            ` : ''}
            
            ${this.leadMagnet && this.leadMagnet.available ? `
                <div class="lead-magnet-section">
                    <div class="lead-magnet-card">
                        <div class="lead-magnet-icon">🎁</div>
                        <div class="lead-magnet-content">
                            <h3>${this.leadMagnet.name}</h3>
                            <p>${this.leadMagnet.description}</p>
                            <button class="btn btn-download" onclick="finder.downloadLeadMagnet()">
                                Download Free PDF →
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="restart-section">
                <button class="btn btn-secondary" onclick="finder.restart()">
                    ← Start Over
                </button>
            </div>
        `;
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    getTopChallenges() {
        const labels = {
            homework: 'Homework Struggles',
            school: 'School Challenges',
            autism: 'Autism Support Needs',
            adhd: 'ADHD Management',
            structure: 'Daily Structure',
            communication: 'Communication',
            daily_life: 'Daily Life',
            preparation: 'Preparing for New Situations',
            medical: 'Medical Appointments',
            development: 'Developmental Milestones',
            milestones: 'Major Life Changes',
            transitions: 'Transitions & Changes',
            social: 'Social Situations',
            anxiety: 'Anxiety & Stress',
            life_skills: 'Life Skills'
        };
        
        const maxScore = 30; // Estimate based on questions
        
        return Object.keys(this.scores)
            .filter(key => this.scores[key] > 0)
            .map(key => ({
                key: key,
                label: labels[key] || key,
                score: this.scores[key],
                percent: Math.min((this.scores[key] / maxScore) * 100, 100)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }
    
    getRecommendations() {
        // Calculate match scores for each product
        const productScores = this.products.map(product => {
            let matchScore = 0;
            
            // Calculate based on priority_score and user's scores
            if (product.priority_score) {
                Object.keys(product.priority_score).forEach(category => {
                    if (this.scores[category]) {
                        matchScore += (product.priority_score[category] || 0) * this.scores[category];
                    }
                });
            }
            
            return {
                product: product,
                score: matchScore
            };
        });
        
        // Sort by score
        productScores.sort((a, b) => b.score - a.score);
        
        // Get top products (remove those with score 0)
        const topProducts = productScores
            .filter(ps => ps.score > 0)
            .slice(0, 3)
            .map(ps => ps.product);
        
        // Get relevant affiliates
        const affiliateScores = this.affiliates.map(affiliate => {
            let matchScore = 0;
            
            if (affiliate.priority_score) {
                Object.keys(affiliate.priority_score).forEach(category => {
                    if (this.scores[category]) {
                        matchScore += (affiliate.priority_score[category] || 0) * this.scores[category];
                    }
                });
            }
            
            return {
                affiliate: affiliate,
                score: matchScore
            };
        });
        
        affiliateScores.sort((a, b) => b.score - a.score);
        
        const topAffiliates = affiliateScores
            .filter(as => as.score > 0)
            .slice(0, 3)
            .map(as => as.affiliate);
        
        return {
            products: topProducts,
            affiliates: topAffiliates
        };
    }
    
    renderProductCard(product, rank) {
        return `
            <div class="product-card">
                <div class="product-rank">#${rank} Recommended</div>
                
                ${product.image ? `
                    <div class="product-image-wrapper">
                        ${product.is_bundle ? '<div class="bundle-badge-overlay">BUNDLE DEAL</div>' : ''}
                        <img src="../${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none'">
                    </div>
                ` : ''}
                
                <div class="product-content">
                    <div class="product-header">
                        <h4>${product.name}</h4>
                    </div>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-helps">
                        <strong>✓ This helps with:</strong>
                        <ul>
                            ${product.helps_with.map(help => `<li>${help}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="product-footer">
                        <div class="product-price">
                            ${product.savings ? `
                                <div class="price-wrapper">
                                    <span class="price-current">$${product.price}</span>
                                    <span class="price-original">$${product.original_price}</span>
                                </div>
                                <div class="price-savings">Save $${product.savings}!</div>
                            ` : `
                                <span class="price-current">$${product.price}</span>
                            `}
                        </div>
                        <a href="${product.url}" class="btn btn-primary" target="_blank" rel="noopener">
                            Get This Now →
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAffiliateCard(affiliate) {
        return `
            <div class="affiliate-card">
                <div class="affiliate-icon">🔗</div>
                <div class="affiliate-content">
                    <h4>${affiliate.name}</h4>
                    <p>${affiliate.description}</p>
                    <a href="${affiliate.url}" class="btn btn-link" target="_blank" rel="noopener">
                        View on Amazon →
                    </a>
                </div>
            </div>
        `;
    }
    
    downloadLeadMagnet() {
        if (this.leadMagnet && this.leadMagnet.file) {
            window.open(`data/${this.leadMagnet.file}`, '_blank');
        }
    }
    
    restart() {
        // Reset state
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.scores = {
            homework: 0,
            school: 0,
            autism: 0,
            adhd: 0,
            structure: 0,
            communication: 0,
            daily_life: 0,
            preparation: 0,
            medical: 0,
            development: 0,
            milestones: 0,
            transitions: 0,
            social: 0,
            anxiety: 0,
            life_skills: 0
        };
        
        // Hide results, show questions
        document.getElementById('results-container').style.display = 'none';
        document.getElementById('questions-container').style.display = 'block';
        
        // Re-render first question
        this.renderQuestion();
        this.updateProgress();
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize app when DOM is ready
let finder;
document.addEventListener('DOMContentLoaded', () => {
    finder = new DailyHelpFinder();
});
