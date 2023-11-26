function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
  }

  function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
  }


document.addEventListener("DOMContentLoaded", function () {
    const LOGIN_FORM = document.getElementById("loginForm");
    const REGISTER_FORM = document.getElementById("registerForm");
  
    LOGIN_FORM.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
  
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        })
        .catch((error) => console.error("Error de login:", error));
    });
  
    REGISTER_FORM.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("registerUsername").value;
      const password = document.getElementById("registerPassword").value;
  
      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        })
        .catch((error) => console.error("Error de registro:", error));
    });
  });
  