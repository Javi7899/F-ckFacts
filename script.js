document.addEventListener('DOMContentLoaded', function() {
    // Random fact generator
    const randomFacts = [
        "Los humanos comparten el 50% de su ADN con los plátanos.",
        "El sonido que hace un pato no hace eco y nadie sabe por qué.",
        "En Japón hay más máquinas expendedoras que personas.",
        "El músculo más fuerte del cuerpo humano es la lengua.",
        "Las mariposas saborean con sus patas.",
        "El nombre original de Google era 'Backrub'.",
        "Los ojos de un avestruz son más grandes que su cerebro."
    ];
    
    const randomFactBtn = document.getElementById('randomFactBtn');
    const randomFactDisplay = document.getElementById('randomFactDisplay');
    
    randomFactBtn.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * randomFacts.length);
        randomFactDisplay.textContent = randomFacts[randomIndex];
        randomFactDisplay.style.display = 'block';
        
        // Animación de flip card
        randomFactDisplay.style.animation = 'none';
        void randomFactDisplay.offsetWidth; // Trigger reflow
        randomFactDisplay.style.animation = 'flipIn 0.6s ease';
    });
    
    // Smooth scroll para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Reveal animations al hacer scroll
    const revealElements = document.querySelectorAll('.episodes, .wtf-fact, .about, .subscribe');
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', checkReveal);
    window.addEventListener('load', checkReveal);
    
    // Efecto parallax para el hero
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const hero = document.querySelector('.hero');
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
});

// Añadir la animación de flip al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes flipIn {
        0% {
            transform: perspective(400px) rotateX(90deg);
            opacity: 0;
        }
        100% {
            transform: perspective(400px) rotateX(0deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);