     function EditUser() {
        let fullname = document.getElementById("fullname").value;
        let email = document.getElementById("email").value;

         // Getting the Url ID parameter
        let urlParams = new URLSearchParams(window.location.search);
        let urlId = urlParams.get("id");
        

        if (fullname == null || email == null) {
          alert("All fields are required.");
          return false;
        }

        let userData = JSON.parse(localStorage.getItem("userData"));

        for (var i = 0; i < userData.length; i++) {
          if (userData[i].email == email && userData[i].id != Number(urlId)) {
            alert("Email already exists. Please use a different email.");
            return false;
          }
        }

        if (userData == null) {
          alert("No user data found. Please register.");
          return false;
        }
       
        // Find the user with matching ID from array
        let user = userData.find(function (u) {
          return u.id == urlId;
        });

     

        for (var i = 0; i < userData.length; i++) {
          if (userData[i].id == Number(urlId)) {
            userData[i].fullname = fullname;
            userData[i].email = email;
            break;
          }
        }

        localStorage.setItem("userData", JSON.stringify(userData));

        alert("User information updated successfully.");
        return true;
      }
 