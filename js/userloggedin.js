// This will be called in head section of logggedin pages to avoid unauthorized access

let logged_In_User = JSON.parse(localStorage.getItem("loggedInUser"));
if (logged_In_User == null) {
  alert("No user is currently logged in. Please log in to continue.");
  window.location.href = "4_login.html"; // Redirect to login page
}