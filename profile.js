document.addEventListener('DOMContentLoaded', () => {
  const currentUserEmail = localStorage.getItem('currentUser');
  if (!currentUserEmail) window.location.href = "login.html";

  const userData = JSON.parse(localStorage.getItem(`user_${currentUserEmail}`));
  if (!userData) window.location.href = "login.html";

  document.getElementById('userName').textContent = userData.name || 'Guest';
  document.getElementById('userEmail').textContent = currentUserEmail;
  
  const regDate = userData.registrationDate ? 
        new Date(userData.registrationDate) : new Date();
  document.getElementById('memberSince').textContent = 
        regDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

  const moodCounts = JSON.parse(localStorage.getItem(`moodCounts_${currentUserEmail}`)) || {};
  const totalMoods = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
  
  document.getElementById('totalMoods').textContent = totalMoods;
  
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  if (topMood) {
      document.getElementById('topMood').innerHTML = `
          ${getMoodEmoji(topMood[0])} ${topMood[0]} 
          <span class="count">(${topMood[1]} times)</span>
      `;
  }

  const listeningTimes = JSON.parse(localStorage.getItem(`listeningTimes_${currentUserEmail}`)) || {};
  document.getElementById('morningCount').textContent = listeningTimes.morning || 0;
  document.getElementById('eveningCount').textContent = listeningTimes.evening || 0;
});

function getMoodEmoji(mood) {
  const emojiMap = {
      'Happy': '😊', 'Sad': '😢', 'Energetic': '⚡',
      'Calm': '🌿', 'Romantic': '❤️', 'Focused': '🎧',
      'Angry': '🔥', 'Nostalgic': '🕰️', 'Party': '🎉',
      'Sleepy': '😴'
  };
  return emojiMap[mood] || '🎵';
}