// Firebase config - replace with your own
const firebaseConfig = {
  apiKey: "AIzaSyATq733SgOlw3uX3hV2rNx8skuxm7aeppA",
  authDomain: "login-page-new-3780c.firebaseapp.com",
  projectId: "login-page-new-3780c",
  storageBucket: "login-page-new-3780c.appspot.com",
  messagingSenderId: "106026228924",
  appId: "1:106026228924:web:3e14f52a3fe928c06644b9"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Show/hide password toggle
function togglePassword() {
  const pwdInput = document.getElementById("password");
  pwdInput.type = pwdInput.type === "password" ? "text" : "password";
}

// Attach toggle password event
document.querySelector('.toggle-password').addEventListener('click', togglePassword);


// Login validation and process
async function validateLogin() {
  const gsno = document.getElementById("no").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!gsno || !password) {
    alert("Please enter GS Service Number and password.");
    return;
  }

  // Validate GS Service Number format: GN + 6 digits
  const gsPattern = /^GN\d{6}$/;
  if (!gsPattern.test(gsno)) {
    alert("Invalid GS Service Number format. Must be 'GN' followed by 6 digits.");
    return;
  }

  if (password.length !== 8) {
    alert("Password must be exactly 8 characters.");
    return;
  }

  try {
    // Query users collection by GS number
    const querySnapshot = await db.collection("users").where("gsno", "==", gsno).get();

    if (querySnapshot.empty) {
      alert("No account found with this GS Service Number.");
      return;
    }

    // Get user email and UID
    const userDoc = querySnapshot.docs[0];
    const userEmail = userDoc.data().email;
    const userId = userDoc.id; // Document ID should be Auth UID

    // Sign in with email and password
    const userCredential = await auth.signInWithEmailAndPassword(userEmail, password);

    // Verify authenticated user matches document ID
   // if (userCredential.user.uid !== userId) {
     // alert("Authenticated user mismatch.");
      //await auth.signOut();
      //return;
  //  }

    alert("Login successful! Redirecting...");
    window.location.href = "final1.html";

  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
}

// Attach login button event
document.querySelector('.btn-login').addEventListener('click', validateLogin);

// Forgot Password handler
document.getElementById('forgotPassword').addEventListener('click', () => {
  const email = prompt("Please enter your registered email:");
  if (!email) return alert("Email is required for password reset.");

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch(err => alert("Reset failed: " + err.message));
});
