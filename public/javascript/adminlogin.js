
function validateLogin() {
    // Get the entered username and password
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    

    // Check if the username and password are correct (for demonstration purposes)
    if (username == 'praveen' && password == 'praveen') {
      alert('Login successful!');
      // You can redirect the user or perform other actions here
    } else {
      alert('Incorrect username or password. Please try again.');
    }
  }
