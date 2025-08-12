// Datos para Verdad o Mito
const truthMythFacts = [
    { fact: "Los humanos comparten el 50% de su ADN con los plátanos", answer: true, explanation: "¡Verdadero! Compartimos aproximadamente la mitad de nuestros genes con los plátanos." },
    { fact: "El sonido que hace un pato no hace eco", answer: false, explanation: "¡Falso! Los patos sí producen eco, es solo un mito urbano." },
    { fact: "En Japón hay más máquinas expendedoras que personas", answer: true, explanation: "¡Verdadero! Hay aproximadamente 1 máquina por cada 23 personas." },
    { fact: "El músculo más fuerte del cuerpo humano es la lengua", answer: false, explanation: "¡Falso! El más fuerte es el masetero (en la mandíbula), aunque la lengua es el más resistente." },
    { fact: "Las mariposas saborean con sus patas", answer: true, explanation: "¡Verdadero! Tienen receptores gustativos en las patas." }
];

// Función para parsear el XML del RSS correctamente
function parseEpisodesFromRSS(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    return Array.from(xmlDoc.querySelectorAll('item')).map(item => {
        // Extraer la imagen del episodio (formato Anchor)
        let imageUrl = 'default-cover.jpg'; // Imagen por defecto
        
        // Primero intentamos con itunes:image
        const itunesImage = item.querySelector('itunes\\:image');
        if (itunesImage) {
            imageUrl = itunesImage.getAttribute('href');
        }
        
        // Si no, buscamos en media:content
        if (imageUrl === 'default-cover.jpg') {
            const mediaContent = item.querySelector('media\\:content');
            if (mediaContent && mediaContent.getAttribute('medium') === 'image') {
                imageUrl = mediaContent.getAttribute('url');
            }
        }
        
        // Si no, buscamos en media:thumbnail
        if (imageUrl === 'default-cover.jpg') {
            const mediaThumbnail = item.querySelector('media\\:thumbnail');
            if (mediaThumbnail) {
                imageUrl = mediaThumbnail.getAttribute('url');
            }
        }
        
        // Si no, buscamos en enclosure con type image
        if (imageUrl === 'default-cover.jpg') {
            const enclosures = item.querySelectorAll('enclosure');
            enclosures.forEach(enc => {
                if (enc.getAttribute('type')?.startsWith('image/')) {
                    imageUrl = enc.getAttribute('url');
                }
            });
        }

        return {
            title: item.querySelector('title').textContent,
            pubDate: item.querySelector('pubDate').textContent,
            audio: item.querySelector('enclosure')?.getAttribute('url') || null,
            image: imageUrl,
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent
        };
    });
}

// Función para renderizar el episodio destacado
function renderFeaturedEpisode(episode) {
    return `
        <div class="featured-episode-cover">
            <img src="${episode.image}" 
                 alt="${episode.title}" 
                 loading="lazy"
                 onerror="this.src='default-cover.jpg'">
            <div class="featured-badge">NUEVO</div>
        </div>
        <div class="featured-episode-content">
            <h3>ÚLTIMO EPISODIO</h3>
            <h2>${episode.title}</h2>
            <div class="featured-meta">
                <span class="featured-date">
                    <i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}
                </span>
            </div>
            <p class="featured-description">${truncateDescription(episode.description, 150)}</p>
            <div class="featured-buttons">
                <a href="${episode.link}" target="_blank" class="btn btn-accent">
                    <i class="fab fa-spotify"></i> Spotify
                </a>
                <a href="${episode.link}" target="_blank" class="btn btn-outline">
                    <i class="fas fa-headphones"></i> Escuchar
                </a>
            </div>
        </div>
    `;
}    // Random fact generator
    const randomFacts = [
        "Los humanos comparten el 50% de su ADN con los plátanos.",
        "El sonido que hace un pato no hace eco y nadie sabe por qué.",
        "En Japón hay más máquinas expendedoras que personas.",
        "El músculo más fuerte del cuerpo humano es la lengua.",
        "Las mariposas saborean con sus patas.",
        "El nombre original de Google era 'Backrub'.",
        "Los ojos de un avestruz son más grandes que su cerebro."
    ];
    
    document.addEventListener('click', function(e) {
        if (e.target.id === 'randomFactBtn') {
            const randomFactDisplay = document.getElementById('randomFactDisplay');
            const randomIndex = Math.floor(Math.random() * randomFacts.length);
            randomFactDisplay.textContent = randomFacts[randomIndex];
            randomFactDisplay.style.display = 'block';
            
            // Animación
            randomFactDisplay.style.animation = 'none';
            void randomFactDisplay.offsetWidth; // Trigger reflow
            randomFactDisplay.style.animation = 'flipIn 0.6s ease';
        }
    });
    
    // Verdad o Mito
    setupTruthMythGame();
    
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
    const revealElements = document.querySelectorAll('.episodes, .wtf-fact, .about, .subscribe, .truth-myth');
    
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
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
});

function setupTruthMythGame() {
    const truthMythText = document.getElementById('truth-myth-text');
    const truthMythResult = document.getElementById('truth-myth-result');
    const newFactBtn = document.getElementById('new-fact-btn');
    const truthBtn = document.querySelector('.btn-truth');
    const mythBtn = document.querySelector('.btn-myth');
    
    let currentFact = null;
    
    function getRandomFact() {
        const randomIndex = Math.floor(Math.random() * truthMythFacts.length);
        currentFact = truthMythFacts[randomIndex];
        truthMythText.textContent = currentFact.fact;
        truthMythResult.textContent = '';
        truthMythResult.className = 'truth-myth-result';
    }
    
    function checkAnswer(userAnswer) {
        if (!currentFact) return;
        
        const isCorrect = userAnswer === currentFact.answer;
        
        if (isCorrect) {
            triggerConfetti();
        }
        
        truthMythResult.textContent = isCorrect ? 
            '¡Correcto! 🎉' : '¡Incorrecto! 😅';
        truthMythResult.className = `truth-myth-result ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Mostrar explicación después de 1 segundo
        setTimeout(() => {
            truthMythResult.textContent += ` ${currentFact.explanation}`;
        }, 1000);
    }
    
    function triggerConfetti() {
        const confettiSettings = {
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        };
        
        if (window.confetti) {
            confetti(confettiSettings);
        }
    }
    
    truthBtn.addEventListener('click', () => checkAnswer(true));
    mythBtn.addEventListener('click', () => checkAnswer(false));
    newFactBtn.addEventListener('click', getRandomFact);
    
    // Iniciar con un fact aleatorio
    getRandomFact();
}

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
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

// Cargar librería de confeti
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);
