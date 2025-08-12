document.addEventListener('DOMContentLoaded', function() {
    fetchEpisodes(true); // true indica que es para la biblioteca completa
});

async function fetchEpisodes(isLibrary = false) {
    try {
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
            renderFullLibrary(episodes);
        }
    } catch (error) {
        console.error('Error fetching episodes:', error);
        renderFullLibrary([]);
    }
}

function renderFullLibrary(episodes) {
    const grid = document.getElementById('full-episodes-grid');
    
    if (episodes.length === 0) {
        grid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se pudieron cargar los episodios. Por favor intenta más tarde.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    episodes.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card library-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image}')"></div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
                </div>
                <p class="episode-description">${truncateDescription(episode.description, 100)}</p>
                <div class="episode-platforms">
                    <a href="${episode.link}" target="_blank" class="platform-btn spotify"><i class="fab fa-spotify"></i></a>
                    <a href="${episode.link}" target="_blank" class="platform-btn apple"><i class="fab fa-apple"></i></a>
                    <a href="${episode.link}" target="_blank" class="platform-btn youtube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        `;
        grid.appendChild(episodeCard);
    });
    
    setupSearch(episodes);
}

function setupSearch(episodes) {
    const searchInput = document.getElementById('search-episodes');
    const filterSelect = document.getElementById('filter-order');
    
    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const filtered = episodes.filter(ep => 
            ep.title.toLowerCase().includes(term) || 
            ep.description.toLowerCase().includes(term)
        );
        renderFullLibrary(filtered);
    });
    
    filterSelect.addEventListener('change', function() {
        const sorted = [...episodes];
        if (this.value === 'newest') {
            sorted.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        } else if (this.value === 'oldest') {
            sorted.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
        }
        renderFullLibrary(sorted);
    });
}

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
