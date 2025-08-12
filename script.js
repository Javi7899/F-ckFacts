// Datos para Verdad o Mito
const truthMythFacts = [
    { fact: "Los humanos comparten el 50% de su ADN con los plátanos", answer: true },
    { fact: "El sonido que hace un pato no hace eco", answer: false },
    { fact: "En Japón hay más máquinas expendedoras que personas", answer: true },
    { fact: "El músculo más fuerte del cuerpo humano es la lengua", answer: false },
    { fact: "Las mariposas saborean con sus patas", answer: true },
    { fact: "El nombre original de Google era 'Backrub'", answer: true },
    { fact: "Los ojos de un avestruz son más grandes que su cerebro", answer: true }
    { fact: "Los humanos comparten el 50% de su ADN con los plátanos", answer: true, explanation: "¡Verdadero! Compartimos aproximadamente la mitad de nuestros genes con los plátanos." },
    { fact: "El sonido que hace un pato no hace eco", answer: false, explanation: "¡Falso! Los patos sí producen eco, es solo un mito urbano." },
    { fact: "En Japón hay más máquinas expendedoras que personas", answer: true, explanation: "¡Verdadero! Hay aproximadamente 1 máquina por cada 23 personas." },
    { fact: "El músculo más fuerte del cuerpo humano es la lengua", answer: false, explanation: "¡Falso! El más fuerte es el masetero (en la mandíbula), aunque la lengua es el más resistente." },
    { fact: "Las mariposas saborean con sus patas", answer: true, explanation: "¡Verdadero! Tienen receptores gustativos en las patas." }
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
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const rssUrl = encodeURIComponent('https://anchor.fm/s/108369df0/podcast/rss');
        const response = await fetch(proxyUrl + rssUrl);
        const data = await response.json();
        
        // Parseamos el contenido XML del RSS
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        
        // Extraemos los episodios
        const items = xmlDoc.querySelectorAll('item');
        const episodes = Array.from(items).map(item => {
            return {
                title: item.querySelector('title').textContent,
                pubDate: item.querySelector('pubDate').textContent,
                audio: item.querySelector('enclosure').getAttribute('url'),
                image: item.querySelector('image')?.getAttribute('href') || 'default-cover.jpg',
                description: item.querySelector('description').textContent,
                link: item.querySelector('link').textContent
            };
        });

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
            renderFullLibrary(episodes);
        } else {
            renderHomeEpisodes(mockEpisodes);
            renderHomeEpisodes(episodes);
        }
    } catch (error) {
        console.error('Error fetching episodes:', error);
        // Mostrar episodios de ejemplo si hay error (solo para desarrollo)
        if (isLibrary) {
            renderFullLibrary([]);
        } else {
            renderHomeEpisodes([]);
        }
    }
}

function renderHomeEpisodes(episodes) {
    // Episodio destacado (el más reciente)
    const featured = episodes[0];
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

    const featured = episodes[0];
    featuredContainer.innerHTML = `
        <div class="featured-episode-cover" style="background-image: url('${featured.image || 'default-cover.jpg'}')">
        <div class="featured-episode-cover" style="background-image: url('${featured.image}')">
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
            <p class="featured-description">${truncateDescription(featured.description, 150)}</p>
            <div class="featured-buttons">
                <a href="${featured.link}" target="_blank" class="btn btn-accent"><i class="fab fa-spotify"></i> Spotify</a>
                <a href="#" target="_blank" class="btn btn-outline"><i class="fab fa-apple"></i> Apple Podcasts</a>
                <a href="${featured.link}" target="_blank" class="btn btn-outline"><i class="fas fa-headphones"></i> Escuchar</a>
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
            <div class="episode-cover" style="background-image: url('${episode.image}')"></div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
                </div>
                <div class="episode-buttons">
                    <a href="${episode.link}" target="_blank" class="btn btn-play"><i class="fab fa-spotify"></i> Escuchar</a>
                    <a href="${episode.link}" target="_blank" class="btn btn-play"><i class="fas fa-play"></i> Escuchar</a>
                </div>
            </div>
        `;
        gridContainer.appendChild(episodeCard);
    });

    // Añadir botón de Random Fact después de los episodios
    const randomFactSection = document.createElement('div');
    randomFactSection.className = 'random-fact-section';
    randomFactSection.innerHTML = `
        <button id="randomFactBtn" class="btn btn-accent">Dame un F*ckFact</button>
        <div id="randomFactDisplay" class="random-fact"></div>
    `;
    gridContainer.parentNode.insertBefore(randomFactSection, gridContainer.nextSibling);
}

// Funciones auxiliares
@@ -119,7 +121,22 @@ function formatDate(dateString) {
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
    const randomFacts = [
        "Los humanos comparten el 50% de su ADN con los plátanos.",
@@ -131,18 +148,18 @@ document.addEventListener('DOMContentLoaded', function() {
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
@@ -216,17 +233,32 @@ function setupTruthMythGame() {

        const isCorrect = userAnswer === currentFact.answer;

        if (isCorrect) {
            triggerConfetti();
        }
        
        truthMythResult.textContent = isCorrect ? 
            '¡Correcto! 🎉' : '¡Incorrecto! 😅';
        truthMythResult.className = `truth-myth-result ${isCorrect ? 'correct' : 'incorrect'}`;

        // Mostrar explicación después de 1 segundo
        setTimeout(() => {
            truthMythResult.textContent += ` ${currentFact.explanation || 
                (currentFact.answer ? 'Es verdadero.' : 'Es falso.')}`;
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
@@ -260,3 +292,8 @@ style.textContent = `
    }
`;
document.head.appendChild(style);

// Cargar librería de confeti
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);
