// Shared functions across pages
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation trigger
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        elements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Depression test scoring system
const depressionTest = {
    questions: [],
    currentQuestion: 0,
    score: 0,
    responses: {},
    
    init: function(questions) {
        this.questions = questions;
    },
    
    nextQuestion: function(answer) {
        this.responses[this.currentQuestion] = answer;
        this.score += answer.value;
        this.currentQuestion++;
    },
    
    getResult: function() {
        if (this.score >= 20) return { severity: 'Severe', recommendation: 'Immediate professional help recommended' };
        if (this.score >= 15) return { severity: 'Moderately Severe', recommendation: 'Professional evaluation suggested' };
        if (this.score >= 10) return { severity: 'Moderate', recommendation: 'Consider professional consultation' };
        if (this.score >= 5) return { severity: 'Mild', recommendation: 'Monitor symptoms and consider self-care' };
        return { severity: 'Minimal', recommendation: 'No significant symptoms detected' };
    }
};