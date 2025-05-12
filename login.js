document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  const user = JSON.parse(localStorage.getItem(`user_${email}`));
  
  if (!user || user.password !== password) {
      alert('Invalid email or password!');
      return;
  }
  
  localStorage.setItem('currentUser', email);
  window.location.href = "profile.html";
});