// Clear previous logged in user data
localStorage.removeItem(`loggedInUser`);
function Login() {
  let index = -1;

  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Check if userData exists
  if (!userData) {
    alert("No user data found. Please register.");
    return false;
  } else {
    // Get form values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Find user with matching email and password

    index = userData.findIndex(
      (user) => user.email === email && user.password === password,
    );

    if (index !== -1) {
      let loggedInUser = userData[index];
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      window.location.href = `./LoginSuccess.html?id=${loggedInUser.id}`;
      return false;
    }

    alert("Invalid email or password.");
    return false;
  }
}
