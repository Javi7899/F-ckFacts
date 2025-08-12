// Datos para Verdad o Mito
const truthMythFacts = [
    { fact: "Los humanos comparten el 50% de su ADN con los plátanos", answer: true },
    { fact: "El sonido que hace un pato no hace eco", answer: false },
    { fact: "En Japón hay más máquinas expendedoras que personas", answer: true },
    { fact: "El músculo más fuerte del cuerpo humano es la lengua", answer: false },
    { fact: "Las mariposas saborean con sus patas", answer: true },
    { fact: "El nombre original de Google era 'Backrub'", answer: true },
    { fact: "Los ojos de un avestruz son más grandes que su cerebro", answer: true }
];

// Función para obtener episodios del RSS
async function fetchEpisodes(isLibrary = false) {
    try {
        // Simulamos datos para el ejemplo (en producción usarías la API real)
        const mockEpisodes = [
            {
                title: "Episodio 20: Los secretos del universo",
                pubDate: new Date().toISOString(),
                audio: "#",
                image: "https://via.placeholder.com/500",
                description: "En este episodio exploramos los misterios más profundos del cosmos y qué sabemos realmente sobre el universo.",
                link: "#"
            },
            {
                title: "Episodio 19: Mitos alimenticios",
                pubDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                audio: "#",
                image: "https://via.placeholder.com/500",
                description: "¿Es cierto que los carbohidratos engordan? ¿Y que la zanahoria mejora la vista? Descúbrelo aquí.",
                link: "#"
            },
            {
                title: "Episodio 18: Animales extraordinarios",
                pubDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                audio: "#",
                image: "https://via.placeholder.com/500",
                description: "Los pulpos tienen tres corazones y sangre azul. ¿Qué otros animales tienen características increíbles?",
                link: "#"
            }
        ];
        
        if (isLibrary) {
            // Para la biblioteca, simulamos más episodios
            const libraryEpisodes = [...mockEpisodes];
            for (let i = 17; i > 0; i--) {
                libraryEpisodes.push({
                    title: `Episodio ${i}: Título del episodio ${i}`,
                    pubDate: new Date(Date.now() - (20 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
                    audio: "#",
                    image: "https://via.placeholder.com/500",
                    description: `Descripción del episodio ${i}. Este es un ejemplo de lo que podrías encontrar en este fascinante episodio.`,
                    link: "#"
                });
            }
            renderFullLibrary(libraryEpisodes);
        } else {
            renderHomeEpisodes(mockEpisodes);
        }
    } catch (error) {
        console.error('Error fetching episodes:', error);
    }
}

function renderHomeEpisodes(episodes) {
    // Episodio destacado (el más reciente)
    const featured = episodes[0];
    const featuredContainer = document.getElementById('featured-episode');
    
    featuredContainer.innerHTML = `
        <div class="featured-episode-cover" style="background-image: url('${featured.image || 'default-cover.jpg'}')">
            <div class="featured-badge">NUEVO</div>
        </div>
        <div class="featured-episode-content">
            <h3>ÚLTIMO EPISODIO</h3>
            <h2>${featured.title}</h2>
            <div class="featured-meta">
                <span class="featured-date"><i class="far fa-calendar-alt"></i> ${formatDate(featured.pubDate)}</span>
                <span class="featured-duration"><i class="far fa-clock"></i> 45 min</span>
            </div>
            <p class="featured-description">${featured.description}</p>
            <div class="featured-buttons">
                <a href="${featured.link}" target="_blank" class="btn btn-accent"><i class="fab fa-spotify"></i> Spotify</a>
                <a href="#" target="_blank" class="btn btn-outline"><i class="fab fa-apple"></i> Apple Podcasts</a>
            </div>
        </div>
    `;
    
    // Grid de episodios (siguientes 3)
    const gridContainer = document.getElementById('episodes-grid');
    gridContainer.innerHTML = '';
    
    const episodesToShow = episodes.slice(1, 4);
    episodesToShow.forEach(episode => {
        const duration = Math.floor(Math.random() * 60) + 20; // Simulamos duración
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image || 'default-cover.jpg'}')">
                <div class="episode-duration">${duration} min</div>
            </div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
                </div>
                <div class="episode-buttons">
                    <a href="${episode.link}" target="_blank" class="btn btn-play"><i class="fab fa-spotify"></i> Escuchar</a>
                </div>
            </div>
        `;
        gridContainer.appendChild(episodeCard);
    });
}

// Funciones auxiliares
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

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
        
        truthMythResult.textContent = isCorrect ? 
            '¡Correcto! 🎉' : '¡Incorrecto! 😅';
        truthMythResult.className = `truth-myth-result ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Mostrar explicación después de 1 segundo
        setTimeout(() => {
            truthMythResult.textContent += ` ${currentFact.explanation || 
                (currentFact.answer ? 'Es verdadero.' : 'Es falso.')}`;
        }, 1000);
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
