let trackMap = {}; 
let allTracks = []; 


document.addEventListener("DOMContentLoaded", () => {
    const mood = getQueryParam('mood');
    const emoji = getMoodEmoji(mood);

    if (mood && emoji) {
        document.getElementById('mood-title').textContent = mood;
        document.getElementById('mood-emoji').textContent = emoji;
        document.getElementById('mood-description').textContent = getDescription(mood);
        document.querySelector('.playlist-title').textContent = `Your ${mood} Playlist`;
    }

    fetchPlaylistForMood();
    initPlaylistControls();

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            filterPlaylist(e.target.value);
        });
    }
});

function fetchPlaylistForMood() {
    const mood = getQueryParam('mood');
    if (!mood) return;

    const playlistContent = document.getElementById("playlist-content");
    playlistContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading your perfect playlist...</p>
        </div>
    `;

    fetch(`get_playlist.php?mood=${mood}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                playlistContent.innerHTML = `<p class="error-message">${data.error}</p>`;
                return;
            }

            allTracks = data.playlist;
            displayPlaylist(allTracks);
        })
        .catch(err => {
            console.error(err);
            playlistContent.innerHTML = `<p class="error-message">Failed to load playlist.</p>`;
        });
}

function displayPlaylist(tracks) {
    const playlistContent = document.getElementById("playlist-content");
    trackMap = {}; 

    const trackHTML = tracks.map((track, index) => {
        const key = encodeURIComponent(track.spotify_url);
        trackMap[key] = track;
        const isFav = isFavorited(track);

        return `
            <div class="track" data-key="${key}">
                <span class="track-number">${index + 1}</span>
                <img class="album-cover" src="${track.album_cover}" alt="Album Cover" />
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${track.artist}</div>
                    <a href="${track.spotify_url}" target="_blank" class="track-link">Play on Spotify</a>
                </div>
                <div class="track-actions">
                    <span class="favorite-icon" data-key="${key}">${isFav ? "❤️" : "🤍"}</span>
                </div>
                <div class="track-duration">${track.duration}</div>
            </div>
        `;
    }).join('');

    playlistContent.innerHTML = trackHTML;

    document.querySelectorAll(".track").forEach(trackEl => {
        trackEl.addEventListener("click", function() {
            const key = this.getAttribute("data-key");
            currentTrack = trackMap[key];
            document.getElementById("existingPlaylists").style.display = "inline-block";
        });
    });

    document.querySelectorAll(".favorite-icon").forEach(icon => {
        icon.addEventListener("click", function(e) {
            e.stopPropagation(); 
            const key = this.getAttribute("data-key");
            toggleFavorite(key, this);
        });
    });
}
  

function filterPlaylist(query) {
    const lowerQuery = query.toLowerCase();
    const filteredTracks = allTracks.filter(track =>
        track.name.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery)
    );
    displayPlaylist(filteredTracks);
}

function toggleFavorite(key, iconElement) {
    const track = trackMap[key];
    if (!track) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(fav => fav.spotify_url === track.spotify_url);

    if (exists) {
        favorites = favorites.filter(fav => fav.spotify_url !== track.spotify_url);
        iconElement.textContent = "🤍";
    } else {
        favorites.push(track);
        iconElement.textContent = "❤️";
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorited(track) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.spotify_url === track.spotify_url);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getMoodEmoji(mood) {
    const emojiMap = {
        Happy: "😊",
        Sad: "😢",
        Energetic: "⚡",
        Calm: "🌿",
        Romantic: "❤️",
        Focused: "🎧",
        Angry: "🔥",
        Nostalgic: "🕰️",
        Party: "🎉",
        Sleepy: "😴"
    };
    return emojiMap[mood] || "🎵";
}

function getDescription(mood) {
    const descriptions = {
        Happy: "Bright, uplifting tunes to boost your mood and keep you smiling.",
        Sad: "Slow, emotional tracks to keep you company.",
        Energetic: "High-tempo beats to keep you pumped.",
        Calm: "Peaceful melodies to help you relax.",
        Romantic: "Songs that stir the heart and soul.",
        Focused: "Ambient sounds to help you concentrate.",
        Angry: "Intense tracks to match your fiery vibes.",
        Nostalgic: "Throwbacks and classics to relive old times.",
        Party: "Get the party started with these bangers.",
        Sleepy: "Soft lullabies and mellow tunes for winding down."
    };
    return descriptions[mood] || "Enjoy your mood-based playlist.";
}
