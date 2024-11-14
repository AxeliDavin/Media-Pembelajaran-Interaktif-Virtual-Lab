const registerForm = document.getElementById('registerForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const submitregister = document.getElementById('submitregister');

window.onload = () => {
  if (sessionStorage.username){
    location.href = '/index';
  }
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();  
    if (username && password) {
      fetch('/register-user', {
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

const validateData =(data) => {
  if(!data.username){
    alert('Register Failed');
  } else {
    alert('Register Successful');
    location.href = '/index';
  }
}