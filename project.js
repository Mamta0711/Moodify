document.addEventListener('DOMContentLoaded', function() {

  const moodGrid = document.getElementById('mood-grid');
  
  moodGrid.addEventListener('click', function(e) {
    const moodCard = e.target.closest('.mood-card');
    if (!moodCard) return;

    const mood = moodCard.dataset.mood;
    const emoji = moodCard.dataset.emoji;

    goToMoodDetails(mood, emoji);
  });

  function goToMoodDetails(mood, emoji) {
    const url = `mood-details.html?mood=${encodeURIComponent(mood)}&emoji=${encodeURIComponent(emoji)}`;
    window.location.href = url;
  }
});
