document.addEventListener('DOMContentLoaded', function() {
    fetchEpisodes(true); // true indica que es para la biblioteca completa
});

function renderFullLibrary(episodes) {
    const grid = document.getElementById('full-episodes-grid');
    grid.innerHTML = '';
    
    episodes.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image || ''}')"></div>
            <h3>${episode.title}</h3>
            <p>${formatDate(episode.pubDate)}</p>
            <button class="btn btn-play" data-audio="${episode.audio}">▶ Reproducir</button>
            <a href="${episode.link}" target="_blank" class="btn btn-accent">Escuchar en Anchor</a>
        `;
        grid.appendChild(episodeCard);
    });
    
    setupAudioPlayers();
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
        } else {
            sorted.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
        }
        renderFullLibrary(sorted);
    });
}