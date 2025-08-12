// Función para obtener episodios del RSS
async function fetchEpisodes(isLibrary = false) {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://anchor.fm/s/108369df0/podcast/rss');
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const episodes = data.items.map(item => ({
                title: item.title,
                pubDate: item.pubDate,
                audio: item.enclosure.link,
                image: item.thumbnail,
                description: item.description,
                link: item.link
            }));
            
            if (isLibrary) {
                renderFullLibrary(episodes);
            } else {
                renderHomeEpisodes(episodes);
            }
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
        <div class="featured-episode-cover" style="background-image: url('${featured.image || ''}')"></div>
        <div class="featured-episode-content">
            <h3>ÚLTIMO EPISODIO</h3>
            <h2>${featured.title}</h2>
            <p>${formatDate(featured.pubDate)}</p>
            <p>${truncateDescription(featured.description)}</p>
            <button class="btn btn-accent btn-play" data-audio="${featured.audio}">▶ Escuchar ahora</button>
            <a href="${featured.link}" target="_blank" class="btn">Ver en Anchor</a>
        </div>
    `;
    
    // Grid de episodios (siguientes 3)
    const gridContainer = document.getElementById('episodes-grid');
    gridContainer.innerHTML = '';
    
    const episodesToShow = episodes.slice(1, 4);
    episodesToShow.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image || ''}')"></div>
            <h3>${episode.title}</h3>
            <p>${formatDate(episode.pubDate)}</p>
            <button class="btn btn-play" data-audio="${episode.audio}">▶ Reproducir</button>
        `;
        gridContainer.appendChild(episodeCard);
    });
    
    setupAudioPlayers();
}

// Funciones auxiliares
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function truncateDescription(description) {
    return description.length > 150 ? 
        `${description.substring(0, 150)}...` : description;
}

function setupAudioPlayers() {
    document.querySelectorAll('.btn-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const audioUrl = this.getAttribute('data-audio');
            // Implementa tu reproductor de audio aquí
            console.log('Reproduciendo:', audioUrl);
        });
    });
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
