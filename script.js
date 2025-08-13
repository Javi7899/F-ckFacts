// Datos para Verdad o Mito
const truthMythFacts = [
    { fact: "Los humanos comparten el 50% de su ADN con los plátanos", answer: true, explanation: "¡Verdadero! Compartimos aproximadamente la mitad de nuestros genes con los plátanos." },
    { fact: "El sonido que hace un pato no hace eco", answer: false, explanation: "¡Falso! Los patos sí producen eco, es solo un mito urbano." },
    { fact: "En Japón hay más máquinas expendedoras que personas", answer: true, explanation: "¡Verdadero! Hay aproximadamente 1 máquina por cada 23 personas." },
    { fact: "El músculo más fuerte del cuerpo humano es la lengua", answer: false, explanation: "¡Falso! El más fuerte es el masetero (en la mandíbula), aunque la lengua es el más resistente." },
    { fact: "Las mariposas saborean con sus patas", answer: true, explanation: "¡Verdadero! Tienen receptores gustativos en las patas." }
];

// Random facts generator
const randomFacts = [
    "Los humanos comparten el 50% de su ADN con los plátanos.",
    "El sonido que hace un pato no hace eco y nadie sabe por qué.",
    "En Japón hay más máquinas expendedoras que personas.",
    "El músculo más fuerte del cuerpo humano es la lengua.",
    "Las mariposas saborean con sus patas.",
    "El nombre original de Google era 'Backrub'.",
    "Los ojos de un avestruz son más grandes que su cerebro."
];

// Nueva función fetchEpisodes mejorada
async function fetchEpisodes(isLibrary = false) {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://anchor.fm/s/108369df0/podcast/rss');
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error('No se encontraron episodios');
        }
        
        const episodes = data.items.map(item => {
            return {
                title: item.title,
                pubDate: item.pubDate,
                audio: item.enclosure.link,
                image: item.thumbnail || 'default-cover.jpg',
                description: item.description,
                link: item.link
            };
        });
        
        if (isLibrary) {
            renderFullLibrary(episodes);
        } else {
            renderHomeEpisodes(episodes);
        }
    } catch (error) {
        console.error('Error fetching episodes:', error);
        if (isLibrary) {
            renderFullLibrary([]);
        } else {
            renderHomeEpisodes([]);
        }
    }
}

// Función para renderizar episodios en home
function renderHomeEpisodes(episodes) {
    const featuredContainer = document.getElementById('featured-episode');
    const gridContainer = document.getElementById('episodes-grid');
    
    if (episodes.length === 0) {
        featuredContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se pudieron cargar los episodios. Por favor intenta más tarde.</p>
            </div>
        `;
        gridContainer.innerHTML = '';
        return;
    }

    // Último episodio (destacado)
    const featured = episodes[0];
    featuredContainer.innerHTML = `
        <div class="featured-episode-cover" style="background-image: url('${featured.image}')">
            <div class="featured-badge">NUEVO</div>
        </div>
        <div class="featured-episode-content">
            <h3>EPISODIO MÁS RECIENTE</h3>
            <h2>${featured.title}</h2>
            <div class="featured-meta">
                <span class="featured-date"><i class="far fa-calendar-alt"></i> ${formatDate(featured.pubDate)}</span>
            </div>
            <p class="featured-description">${truncateDescription(featured.description, 150)}</p>
            <div class="featured-buttons">
                <a href="${featured.link}" target="_blank" class="btn btn-accent"><i class="fab fa-spotify"></i> Escuchar en Spotify</a>
                <a href="${featured.link}" target="_blank" class="btn btn-outline"><i class="fas fa-external-link-alt"></i> Más plataformas</a>
            </div>
        </div>
    `;
    
    // Episodios anteriores (siguientes 3)
    gridContainer.innerHTML = '';
    
    const episodesToShow = episodes.slice(1, 4);
    episodesToShow.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image}')"></div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
                </div>
                <div class="episode-buttons">
                    <a href="${episode.link}" target="_blank" class="btn btn-play"><i class="fas fa-headphones"></i> Escuchar</a>
                </div>
            </div>
        `;
        gridContainer.appendChild(episodeCard);
    });
}

// Juego Verdad o Mito
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
    
    truthBtn.addEventListener('click', () => checkAnswer(true));
    mythBtn.addEventListener('click', () => checkAnswer(false));
    newFactBtn.addEventListener('click', getRandomFact);
    
    // Iniciar con un fact aleatorio
    getRandomFact();
}

// Función para lanzar confeti
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

// Funciones auxiliares
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function truncateDescription(text, maxLength) {
    if (!text) return '';
    // Eliminar etiquetas HTML si las hay
    const div = document.createElement('div');
    div.innerHTML = text;
    const cleanText = div.textContent || div.innerText || '';
    
    return cleanText.length > maxLength ? 
        `${cleanText.substring(0, maxLength)}...` : cleanText;
}

// Configuración inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar episodios
    fetchEpisodes();
    
    // Random fact generator
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

// Añadir animación de flip al CSS
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
// Efecto especial para el nombre en el footer
document.querySelectorAll('.name-part').forEach((part, index) => {
    part.style.animationDelay = `${index * 0.1}s`;
    
    part.addEventListener('mouseenter', () => {
        part.style.transform = 'translateY(-5px)';
        part.style.textShadow = `0 5px 15px rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
    });
    
    part.addEventListener('mouseleave', () => {
        part.style.transform = '';
        part.style.textShadow = '';
    });
});

// Efecto de confeti al hacer clic en el nombre
document.querySelector('.dev-name').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Confeti personalizado
    if (window.confetti) {
        const colors = ['#ff0033', '#00ff88', '#0099ff'];
        
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0.8, y: 1 },
            colors: colors
        });
        
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 0.2, y: 1 },
            colors: colors
        });
    }
    
    // Abre el enlace después de la animación
    setTimeout(() => {
        window.open(e.target.href, '_blank');
    }, 500);
});// Notificaciones de redes sociales
function setupSocialNotifications() {
    const notifications = [
        {
            app: "Instagram",
            message: "Nuevo episodio disponible: 'Los secretos del ADN que te volarán la cabeza'",
            icon: "fab fa-instagram",
            class: "instagram",
            url: "https://www.instagram.com/fckfacts.corp/"
        },
        {
            app: "TikTok",
            message: "¿Sabías esto? Mira nuestro último F*CKFACT en el nuevo episodio",
            icon: "fab fa-tiktok",
            class: "tiktok",
            url: "https://www.tiktok.com/@fckfacts.corp"
        },
        {
            app: "Facebook",
            message: "¡WTF! No te pierdas el episodio #25 con datos que no creerás",
            icon: "fab fa-facebook-f",
            class: "facebook",
            url: "https://www.facebook.com/profile.php?id=61579196526923"
        },
        {
            app: "YouTube",
            message: "Video nuevo: Los 10 facts más impactantes del mes",
            icon: "fab fa-youtube",
            class: "youtube",
            url: "https://www.youtube.com/channel/UC0PaghHcl1DOlMxeh82Wp3Q"
        },
        {
            app: "X",
            message: "Acabamos de publicar un dato que te hará cuestionar todo #FckFacts",
            icon: "fab fa-twitter",
            class: "twitter",
            url: "https://x.com/FckFactsCorp"
        }
    ];

    const container = document.querySelector('.notifications-container');
    
    // Crear notificaciones
    notifications.forEach(notif => {
        const notification = document.createElement('div');
        notification.className = `notification ${notif.class}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${notif.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-app">${notif.app}</div>
                <div class="notification-message">${notif.message}</div>
            </div>
        `;
        
        notification.addEventListener('click', () => {
            window.open(notif.url, '_blank');
        });
        
        container.appendChild(notification);
    });

    // Animación en bucle
    const notificationElements = document.querySelectorAll('.notification');
    let currentIndex = 0;
    
    function showNextNotification() {
        // Ocultar todas
        notificationElements.forEach(notif => {
            notif.classList.remove('visible');
        });
        
        // Mostrar la actual
        notificationElements[currentIndex].classList.add('visible');
        
        // Incrementar índice
        currentIndex = (currentIndex + 1) % notificationElements.length;
    }

    // Iniciar ciclo cada 3 segundos
    showNextNotification();
    setInterval(showNextNotification, 3000);
}

// Llamar la función al cargar
document.addEventListener('DOMContentLoaded', setupSocialNotifications);
