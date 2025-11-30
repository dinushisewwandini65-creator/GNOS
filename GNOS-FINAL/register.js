// Wait until DOM is loaded
window.addEventListener("DOMContentLoaded", () => {

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyATq733SgOlw3uX3hV2rNx8skuxm7aeppA",
    authDomain: "login-page-new-3780c.firebaseapp.com",
    projectId: "login-page-new-3780c",
    storageBucket: "login-page-new-3780c.appspot.com",
    messagingSenderId: "106026228924",
    appId: "1:106026228924:web:3e14f52a3fe928c06644b9"
  };

  // Initialize Firebase
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Elements
  const form = document.getElementById("registerForm");
  const submitBtn = document.getElementById("submitBtn");
  const preview = document.getElementById("photoPreview");
  const photoInput = document.getElementById("photo");
  const togglePwdBtn = document.getElementById("togglePwd");

  // Photo preview
  photoInput.addEventListener("change", function(){
    const file = this.files[0];
    if(!file){
      preview.innerHTML = '<span style="font-size:12px;color:#9ca3af">No photo</span>';
      return;
    }
    if(file.size > 2*1024*1024){
      alert("File too large (max 2MB)");
      this.value = '';
      preview.innerHTML = '<span style="font-size:12px;color:#9ca3af">No photo</span>';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => preview.innerHTML = '<img src="'+e.target.result+'" alt="Preview">';
    reader.readAsDataURL(file);
  });

  // Toggle password
  togglePwdBtn.addEventListener("click", function(){
    const pwd = document.getElementById("password");
    const conf = document.getElementById("confirm");
    if(pwd.type === "password"){ pwd.type = conf.type = "text"; this.textContent="Hide"; }
    else{ pwd.type = conf.type = "password"; this.textContent="Show"; }
  });

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const nic = document.getElementById("nic").value.trim();
    const gsNumber = document.getElementById("gsno").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const division = document.getElementById("division").value.trim();
    const address = document.getElementById("address").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();
    const terms = document.getElementById("terms").checked;

    // Simple validation
    if(!fullname || !nic || !gsNumber || !email || !phone || !division || !address || password.length < 8 || password !== confirm || !terms){
      alert("Please fill all fields correctly.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
      // Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Firestore
      await db.collection("users").doc(user.uid).set({
        fullname,
        no: gsNumber,
        nic,
        email,
        phone,
        division,
        address,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        verified: false
      });

      alert("✅ Registration successful! Redirecting to login...");
      window.location.href = "l3.html";

    } catch(err) {
      console.error("Registration error:", err);
      alert("❌ " + (err.message || "Registration failed."));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }

  });

});

// register.js
(() => {
  // ---------- Config & refs ----------
  // DOM
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const togglePwd = document.getElementById('togglePwd');
  const photoInput = document.getElementById('photo');
  const photoPreview = document.getElementById('photoPreview');

  // error nodes
  const setErr = (id, msg) => {
    const el = document.getElementById('err-' + id);
    if (el) el.textContent = msg || '';
  };

  // simple helpers
  const byId = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // convert file -> dataURL (base64)
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // show preview inside .photo-preview
  async function updatePhotoPreview(file) {
    const container = photoPreview;
    if (!file) {
      container.innerHTML = '<span style="font-size:12px;color:#9ca3af">No photo</span>';
      return;
    }
    try {
      const dataUrl = await fileToDataURL(file);
      container.innerHTML = `<img src="${dataUrl}" alt="preview">`;
    } catch (err) {
      container.innerHTML = '<span style="font-size:12px;color:#9ca3af">Preview failed</span>';
    }
  }

  photoInput.addEventListener('change', (ev) => {
    const f = ev.target.files && ev.target.files[0];
    updatePhotoPreview(f);
  });

  // Toggle show/hide password
  togglePwd.addEventListener('click', () => {
    const pw = byId('password');
    const confirm = byId('confirm');
    if (!pw || !confirm) return;
    const type = pw.type === 'password' ? 'text' : 'password';
    pw.type = type;
    confirm.type = type;
    togglePwd.textContent = type === 'text' ? 'Hide' : 'Show';
  });

  // ---------- Firebase (compat) is expected to be available globally ----------
  if (!window.firebase || !firebase.apps) {
    console.warn('Firebase compat SDK not detected. Make sure you included the compat scripts.');
  }

  // ---------- Validation ----------
  function validateForm(values) {
    // reset errors
    ['fullname','nic','email','phone','number','division','address','password','confirm','photo','terms'].forEach(k => setErr(k,''));

    let ok = true;

    if (!values.fullname) { setErr('fullname','Full name is required'); ok = false; }
    if (!values.nic) { setErr('nic','NIC is required'); ok = false; }
    if (!values.email) { setErr('email','Email is required'); ok = false; }
    if (!values.phone) { setErr('phone','Phone is required'); ok = false; }
    if (!values.gsno) { setErr('number','GS number required'); ok = false; }
    if (!values.division) { setErr('division','GN Division required'); ok = false; }
    if (!values.address) { setErr('address','Address required'); ok = false; }
    if (!values.password || values.password.length < 8) { setErr('password','Password must be at least 8 characters'); ok = false; }
    if (values.password !== values.confirm) { setErr('confirm','Passwords do not match'); ok = false; }
    if (!values.terms) { setErr('terms','You must accept the terms'); ok = false; }

    // photo optional but size check if present
    if (values.photoFile) {
      const maxBytes = 2 * 1024 * 1024; // 2MB
      if (values.photoFile.size > maxBytes) { setErr('photo','Photo too large (max 2MB)'); ok = false; }
    }

    return ok;
  }

  // ---------- Main submit handler ----------
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    // disable
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';

    // collect
    const fullname = byId('fullname').value.trim();
    const nic = byId('nic').value.trim();
    const email = byId('email').value.trim();
    const phone = byId('phone').value.trim();
    const gsno = byId('gsno').value.trim();
    const division = byId('division').value.trim();
    const address = byId('address').value.trim();
    const password = byId('password').value;
    const confirm = byId('confirm').value;
    const photoFile = photoInput.files && photoInput.files[0];
    const terms = byId('terms').checked;

    const values = { fullname, nic, email, phone, gsno, division, address, password, confirm, photoFile, terms };

    try {
      // validate
      if (!validateForm(values)) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        return;
      }

      // Create auth user
      const auth = firebase.auth();
      let userCredential;
      try {
        userCredential = await auth.createUserWithEmailAndPassword(email, password);
      } catch (authErr) {
        // friendly messages
        let msg = authErr.message || 'Registration failed';
        if (authErr.code === 'auth/email-already-in-use') msg = 'Email already in use';
        if (authErr.code === 'auth/invalid-email') msg = 'Invalid email';
        alert('Error: ' + msg);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        return;
      }

      const user = userCredential.user;
      const uid = user.uid;

      // convert photo to dataURL (optional)
      let photoDataUrl = '';
      if (photoFile) {
        try {
          photoDataUrl = await fileToDataURL(photoFile);
        } catch (pfErr) {
          console.warn('Photo convert failed', pfErr);
        }
      }

      // Prepare Firestore doc fields (match the profile page)
      const docData = {
        fullName: fullname,
        nic: nic,
        email: email,
        phone: phone,
        address: address,
        province: '',            // left blank (you can add a field on form later)
        gnDivision: division,    // division field
        divCode: gsno,           // use GS number as division code (you can change)
        district: '',            // blank for now
        officeContact: phone,    // reuse phone as office contact
        username: (email && email.split('@')[0]) || fullname.split(' ')[0].toLowerCase(),
        lastLogin: new Date().toLocaleString(),
        photoURL: photoDataUrl || '',
        createdAt: new Date().toISOString()
      };

      // Save to Firestore (compat)
      const db = firebase.firestore();
      try {
        await db.collection('users').doc(uid).set(docData);
      } catch (fsErr) {
        console.error('Firestore write failed', fsErr);
        // Attempt cleanup: delete auth user if we want (optional)
        try { await user.delete(); } catch(e){ console.warn('Cleanup auth delete failed', e); }
        alert('Could not save profile. Try again later.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        return;
      }

      // optional: update user's displayName & photoURL in Auth profile
      try {
        await user.updateProfile({
          displayName: fullname,
          photoURL: photoDataUrl || null
        });
      } catch (uErr) {
        console.warn('Auth profile update failed', uErr);
      }

      // success
      alert('✅ Registration successful. Redirecting to profile...');
      // brief delay
      await sleep(600);
      // redirect to profile page (change filename if different)
      window.location.href = 'p.html';

    } catch (err) {
      console.error('Registration unexpected error', err);
      alert('Registration error: ' + (err.message || err));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register';
    }
  });
})();

// Firebase configuration
 const firebaseConfig = {
      apiKey: "AIzaSyATq733SgOlw3uX3hV2rNx8skuxm7aeppA",
      authDomain: "login-page-new-3780c.firebaseapp.com",
      projectId: "login-page-new-3780c",
      storageBucket: "login-page-new-3780c.appspot.com",
      messagingSenderId: "106026228924",
      appId: "1:106026228924:web:3e14f52a3fe928c06644b9"
    };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Register form handling
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const nic = document.getElementById("nic").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const gsno = document.getElementById("gsno").value.trim();
  const division = document.getElementById("division").value.trim();
  const address = document.getElementById("address").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm").value.trim();
  const terms = document.getElementById("terms").checked;
  const photoFile = document.getElementById("photo").files[0];

  // Basic validation
  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  if (!terms) {
    alert("Please accept the terms to continue.");
    return;
  }

  // Disable button while processing
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.innerText = "Registering...";

  try {
    // 1️⃣ Create user in Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    let photoURL = "";

    // 2️⃣ If photo uploaded — save to Firebase Storage
    if (photoFile) {
      const storageRef = firebase.storage().ref(`profile_photos/${user.uid}/${photoFile.name}`);
      await storageRef.put(photoFile);
      photoURL = await storageRef.getDownloadURL();
    }

    // 3️⃣ Save all details in Firestore
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      fullname,
      nic,
      email,
      phone,
      gsno,
      division,
      address,
      photoURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Registration successful!");
    window.location.href = "p.html"; // redirect to profile page

  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }

  btn.disabled = false;
  btn.innerText = "Register";
});
