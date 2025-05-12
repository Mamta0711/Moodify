document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const dob = document.getElementById('dob').value;

  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (localStorage.getItem(`user_${email}`)) {
    alert('This email is already registered!');
    return;
  }

 
  const user = {
    name,
    email, 
    password,
    dob,
    registrationDate: new Date().toISOString() 
  };

  
  localStorage.setItem(`user_${email}`, JSON.stringify(user));
  
 
  localStorage.setItem(`moodCounts_${email}`, JSON.stringify({})); 
  localStorage.setItem(`selectedMoods_${email}`, JSON.stringify([])); 
  localStorage.setItem(`listeningTimes_${email}`, JSON.stringify({ 
    morning: 0,
    afternoon: 0,
    evening: 0
  }));

  localStorage.setItem('currentUser', email);
  alert('Registration successful! Welcome to Moodify!');
  window.location.href = "profile.html";
});