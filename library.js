document.addEventListener('DOMContentLoaded', function() {
    fetchEpisodes(true); // true indica que es para la biblioteca completa
});

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
    
    episodes.forEach((episode, index) => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card library-card';
        episodeCard.innerHTML = `
            <div class="library-card-header">
                <span class="episode-number">Episodio #${episodes.length - index}</span>
                <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
            </div>
            <div class="library-card-content">
                <div class="library-card-cover" style="background-image: url('${episode.image}')"></div>
                <div class="library-card-info">
                    <h3>${episode.title}</h3>
                    <p class="episode-description">${truncateDescription(episode.description, 200)}</p>
                    <div class="library-card-buttons">
                        <a href="${episode.link}" target="_blank" class="btn btn-accent btn-sm">
                            <i class="fab fa-spotify"></i> Escuchar
                        </a>
                        <a href="${episode.link}" target="_blank" class="btn btn-outline btn-sm">
                            <i class="fas fa-external-link-alt"></i> Más opciones
                        </a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(episodeCard);
    });
    
    setupSearchAndFilter(episodes);
}

function setupSearchAndFilter(episodes) {
    const searchInput = document.getElementById('search-episodes');
    const filterSelect = document.getElementById('filter-order');
    
    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const filtered = episodes.filter(ep => 
            ep.title.toLowerCase().includes(term) || 
            ep.description.toLowerCase().includes(term)
        );
        renderFilteredEpisodes(filtered);
    });
    
    filterSelect.addEventListener('change', function() {
        const sorted = [...episodes];
        if (this.value === 'newest') {
            sorted.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        } else if (this.value === 'oldest') {
            sorted.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
        }
        renderFilteredEpisodes(sorted);
    });
}

function renderFilteredEpisodes(filteredEpisodes) {
    const grid = document.getElementById('full-episodes-grid');
    
    if (filteredEpisodes.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No se encontraron episodios que coincidan con tu búsqueda</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    filteredEpisodes.forEach((episode, index) => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card library-card';
        episodeCard.innerHTML = `
            <div class="library-card-header">
                <span class="episode-number">Episodio #${filteredEpisodes.length - index}</span>
                <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
            </div>
            <div class="library-card-content">
                <div class="library-card-cover" style="background-image: url('${episode.image}')"></div>
                <div class="library-card-info">
                    <h3>${episode.title}</h3>
                    <p class="episode-description">${truncateDescription(episode.description, 200)}</p>
                    <div class="library-card-buttons">
                        <a href="${episode.link}" target="_blank" class="btn btn-accent btn-sm">
                            <i class="fab fa-spotify"></i> Escuchar
                        </a>
                        <a href="${episode.link}" target="_blank" class="btn btn-outline btn-sm">
                            <i class="fas fa-external-link-alt"></i> Más opciones
                        </a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(episodeCard);
    });
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
