document.addEventListener('DOMContentLoaded', function() {
    fetchEpisodes(true); // true indica que es para la biblioteca completa
});

function renderFullLibrary(episodes) {
    const grid = document.getElementById('full-episodes-grid');
    grid.innerHTML = '';
    
    episodes.forEach(episode => {
        const duration = Math.floor(Math.random() * 60) + 20; // Simulamos duración (en producción usarías la real)
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card library-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image || 'default-cover.jpg'}')">
                <div class="episode-duration">${duration} min</div>
            </div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
                    <span class="episode-duration-mobile"><i class="far fa-clock"></i> ${duration} min</span>
                </div>
                <p class="episode-description">${truncateDescription(episode.description, 100)}</p>
                <div class="episode-platforms">
                    <a href="${episode.link}" target="_blank" class="platform-btn spotify"><i class="fab fa-spotify"></i></a>
                    <a href="#" target="_blank" class="platform-btn apple"><i class="fab fa-apple"></i></a>
                    <a href="#" target="_blank" class="platform-btn youtube"><i class="fab fa-youtube"></i></a>
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
        } else if (this.value === 'duration-asc') {
            sorted.sort((a, b) => a.duration - b.duration);
        } else if (this.value === 'duration-desc') {
            sorted.sort((a, b) => b.duration - a.duration);
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
    return text.length > maxLength ? 
        `${text.substring(0, maxLength)}...` : text;
}
