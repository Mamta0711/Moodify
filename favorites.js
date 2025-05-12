document.addEventListener("DOMContentLoaded", function() {
    displayFavorites();
});

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContent = document.getElementById('favorites-content');

    if (favorites.length === 0) {
        favoritesContent.innerHTML = "<p>No favorite songs yet.</p>";
        return;
    }

    favoritesContent.innerHTML = favorites.map(track => {
        return `
            <div class="favorite-track">
                <img class="album-cover" src="${track.album_cover}" alt="Album Cover" />
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${track.artist}</div>
                    <a href="${track.spotify_url}" target="_blank" class="track-link">Play on Spotify</a>
                </div>
                <button class="remove-btn" onclick='removeFromFavorites(${JSON.stringify(track)})'>Remove</button>
            </div>
        `;
    }).join('');
}

function removeFromFavorites(track) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.spotify_url !== track.spotify_url);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    displayFavorites();  
}
