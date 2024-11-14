const loginForm = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const submitregister = document.getElementById('submitregister');

window.onload = () => {
    if (sessionStorage.username){
      location.href = '/pertanyaan';
    }
  }

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();  
    if (username && password) {
      fetch('/login-user', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        })
      })
      .then(res => res.json())
      .then(data => {
        validateData(data);
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Something went wrong. Please try again later.');
      });
    }
  });
}

const validateData = (data) => {
  if(!data.username){
    alert('Login Failed');
  } else {
      alert('Login Successful');
      sessionStorage.username = data.username;
      sessionStorage.totalQuestions = data.totalquestions;
      sessionStorage.correctAnswers = data.correct;
      sessionStorage.wrongAnswers = data.wrong;

      location.href = '/pertanyaan';
  }
}
