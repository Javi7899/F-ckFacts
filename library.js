function renderFullLibrary(episodes) {
    const grid = document.getElementById('full-episodes-grid');
    grid.innerHTML = '';
    
    episodes.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card library-card';
        episodeCard.innerHTML = `
            <div class="episode-cover">
                <img src="${episode.image}" 
                     alt="${episode.title}" 
                     loading="lazy"
                     onerror="this.src='default-cover.jpg'">
            </div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date">
                        <i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}
                    </span>
                </div>
                <p class="episode-description">${truncateDescription(episode.description, 100)}</p>
                <div class="episode-platforms">
                    <a href="${episode.link}" target="_blank" class="platform-btn spotify">
                        <i class="fab fa-spotify"></i>
                    </a>
                    <a href="${episode.link}" target="_blank" class="platform-btn apple">
                        <i class="fab fa-apple"></i>
                    </a>
                    <a href="${episode.link}" target="_blank" class="platform-btn youtube">
                        <i class="fab fa-youtube"></i>
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(episodeCard);
    });
}
