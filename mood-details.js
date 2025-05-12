window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const mood = params.get("mood");
    const emoji = params.get("emoji");
  
    if (!mood || !emoji) {
      document.getElementById("moodName").textContent = "Unknown Mood";
      return;
    }
  
    document.getElementById("moodName").textContent = mood;
    document.getElementById("emoji").textContent = emoji;
  
    const playlistSection = document.getElementById("playlistSection");
  
    const moodPlaylists = {
        Happy: [
          { title: "Happy", artist: "Pharrell Williams" },
          { title: "Best Day of My Life", artist: "American Authors" },
          { title: "Walking on Sunshine", artist: "Katrina and the Waves" }
        ],
        Sad: [
          { title: "Someone Like You", artist: "Adele" },
          { title: "Let Her Go", artist: "Passenger" },
          { title: "Fix You", artist: "Coldplay" }
        ],
        Energetic: [
          { title: "Stronger", artist: "Kanye West" },
          { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
          { title: "Titanium", artist: "David Guetta ft. Sia" }
        ],
        Calm: [
          { title: "Weightless", artist: "Marconi Union" },
          { title: "River Flows In You", artist: "Yiruma" },
          { title: "Bloom", artist: "The Paper Kites" }
        ],
        Romantic: [
          { title: "Perfect", artist: "Ed Sheeran" },
          { title: "All of Me", artist: "John Legend" },
          { title: "Thinking Out Loud", artist: "Ed Sheeran" }
        ],
        Focused: [
          { title: "Time", artist: "Hans Zimmer" },
          { title: "Intro", artist: "The xx" },
          { title: "Sunset Lover", artist: "Petit Biscuit" }
        ],
        Angry: [
          { title: "Breaking the Habit", artist: "Linkin Park" },
          { title: "Smells Like Teen Spirit", artist: "Nirvana" },
          { title: "Killing in the Name", artist: "Rage Against the Machine" }
        ],
        Nostalgic: [
          { title: "Bohemian Rhapsody", artist: "Queen" },
          { title: "Hotel California", artist: "Eagles" },
          { title: "Take On Me", artist: "A-ha" }
        ],
        Party: [
          { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
          { title: "Party Rock Anthem", artist: "LMFAO" },
          { title: "Don't Stop The Music", artist: "Rihanna" }
        ],
        Sleepy: [
          { title: "Clair de Lune", artist: "Debussy" },
          { title: "Night Owl", artist: "Galimatias" },
          { title: "Pure Shores", artist: "All Saints" }
        ]
      };
      
  
    const songs = moodPlaylists[mood] || [];
  
    if (songs.length === 0) {
      playlistSection.innerHTML = `<p>No songs found for this mood yet.</p>`;
      return;
    }
  
    songs.forEach((song) => {
      const card = document.createElement("div");
      card.className = "playlist-card";
      card.innerHTML = `
        <p><strong>${song.title}</strong> by ${song.artist}</p>
        <button onclick="saveToFavorites('${song.title}', '${song.artist}')">❤️ Save to Favorites</button>
      `;
      playlistSection.appendChild(card);
    });
  };
  
  function saveToFavorites(title, artist) {
    const currentUserEmail = localStorage.getItem("currentUser");
    if (!currentUserEmail) {
      alert("Please log in to save favorites.");
      return;
    }
  
    const key = `favorites_${currentUserEmail}`;
    let favorites = JSON.parse(localStorage.getItem(key)) || [];
  
    const newEntry = `${title} by ${artist}`;
    if (!favorites.includes(newEntry)) {
      favorites.push(newEntry);
      localStorage.setItem(key, JSON.stringify(favorites));
      alert("Song added to favorites!");
    } else {
      alert("This song is already in your favorites.");
    }
  }
  