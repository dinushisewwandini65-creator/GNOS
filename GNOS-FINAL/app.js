
// Basic client-side functionality: translations, simple auth with localStorage, service access control, downloads open new tab handled by viewer.html

let current = 0;
const images = document.querySelectorAll('.carousel-img');
setInterval(() => {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
}, 3000); // Change image every 3 seconds


const i18n = {
  en: {
    title: "Grama Niladhari Online Services",
    subtitle: "An Official Portal To Streamline Key GN Services",
    about_heading: "About",
    about_text: "The Digital Service Management System for Grama Niladhari Offices has been developed to address the limitations of traditional appointment and document handling processes by introducing a comprehensive digital platform. The system integrates core functions such as person registration, identification document processing, and certificate issuance within a centralized web application. By incorporating a structured backend for service tracking and record-keeping, the project aims to enhance operational efficiency, ensure data accuracy, and improve the overall accessibility of services for both officers and citizens. This initiative reflects a significant step toward digital transformation in public administration, aligning with the broader objective of delivering reliable, transparent, and citizen-friendly governance.",
    services_heading: "Services",
    svc_verification: "Verification of NIC",
    svc_verification_desc: "Verify NIC details using the official elections portal.",
    svc_person_reg: "Person Registration",
    svc_person_reg_desc: "Register person details for the GN division and forum entries.",
    svc_character: "Issuing Character Certificates",
    svc_character_desc: "Generate a character certificate from entered person details.",
    downloads_heading: "Downloads",
    info_heading: "Grama Niladhari Information Center",
    info_text: "View administrative GN information across districts and divisions."
  },
  si: {
    title: "ග්‍රාම නිලධාරී අන්තර්ජාල සේවාවන්",
    subtitle: "ප්‍රධාන GN සේවයන් සරල කරගැනීම සඳහා නිල වශයෙන්.",
    about_heading: "වර්ණනා",
    about_text: "ක්‍රියාත්මක කිරීමට නිර්මාණය කරන ලද ...",
    services_heading: "සේවා",
    svc_verification: "හැදුනුම්පත් පරීක්ෂාව",
    svc_verification_desc: "වෝටර් ලියාපදිංචි තොරතුරු පරීක්ෂා කරන්න.",
    svc_person_reg: "පුද්ගල ලියාපදිංචි කිරීම",
    svc_person_reg_desc: "පුද්ගල විස්තර ලියාපදිංචි කරන්න.",
    svc_character: "චරිත සහතික නිකුත් කිරීම",
    svc_character_desc: "භාවිතා කිරීම සඳහා චරිත සහතිකය සකසන්න.",
    downloads_heading: "භාගයන්",
    info_heading: "ග්‍රාම නිලධාරී තොරතුරු මධ්‍යස්ථානය",
    info_text: "කලාප හා කොට්ඨාශ මට්ටමින් තොරතුරු බලන්න."
  },
  ta: {
    title: "கிராம நிர்வாகி ஆன்லைன் சேவைகள்",
    subtitle: "முக்கிய GN சேவைகளைச் சீரமைத்துக் கொள்ளும் அதிகாரப்பூர்வ போர்டல்",
    about_heading: "பற்றி",
    about_text: "இந்த அமைப்பு உருவாக்கப்பட்டது ...",
    services_heading: "சேவைகள்",
    svc_verification: "அடையாள அட்டை சரிபார்ப்பு",
    svc_verification_desc: "வாக்காளர் பட்டியல் மூலம் சரிபார்க்கவும்.",
    svc_person_reg: "மக்கள் பதிவு",
    svc_person_reg_desc: "பிரிவிற்கான நபர் பதிவுகள்.",
    svc_character: "பண்புச் சான்றிதழ் வெளியீடு",
    svc_character_desc: "பண்புச் சான்றிதழ் உருவாக்கவும்.",
    downloads_heading: "பதிவிறக்கங்கள்",
    info_heading: "கிராம நிர்வாகி தகவல் மையம்",
    info_text: "மாவட்டம் மற்றும் பிரிவுகள் தொடர்பான தகவல்கள்."
  }
};

function translate(lang){
  const dict = i18n[lang] || i18n.en;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = dict[key] || '';
  });
}
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.addEventListener('click', ()=>{ translate(b.dataset.lang); });
});
// default english
translate('en');

// smooth scroll links
document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const href = a.getAttribute('href');
    const el = document.querySelector(href);
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
});

// last update
document.getElementById('lastUpdate').textContent = new Date().toLocaleString();

// signup/signin logic using localStorage
const usersKey = 'gnos_users_v1';
function loadUsers(){ return JSON.parse(localStorage.getItem(usersKey)||'[]'); }
function saveUsers(u){ localStorage.setItem(usersKey, JSON.stringify(u)); }

function currentUser(){ return JSON.parse(localStorage.getItem('gnos_current')||'null'); }
function setCurrent(u){ localStorage.setItem('gnos_current', JSON.stringify(u)); updateUIForAuth(); }

function updateUIForAuth(){
  const user = currentUser();
  document.querySelectorAll('.lock').forEach(el=>{
    if(user) el.style.display='none'; else el.style.display='block';
  });
}

document.getElementById('signinBtn').addEventListener('click', ()=>{ document.getElementById('signinModal').classList.remove('hidden'); });
document.getElementById('closeSignin').addEventListener('click', ()=>{ document.getElementById('signinModal').classList.add('hidden'); });
document.getElementById('registerBtn').addEventListener('click', ()=>{ document.getElementById('registerModal').classList.remove('hidden'); });
document.getElementById('closeRegister').addEventListener('click', ()=>{ document.getElementById('registerModal').classList.add('hidden'); });

document.getElementById('doRegister').addEventListener('click', ()=>{
  const name=document.getElementById('regName').value.trim();
  const email=document.getElementById('regEmail').value.trim();
  const phone=document.getElementById('regPhone').value.trim();
  const user=document.getElementById('regUser').value.trim();
  const pass=document.getElementById('regPass').value;
  if(!name||!user||!pass){ document.getElementById('registerMsg').textContent='Please fill name, username and password'; return; }
  const users=loadUsers();
  if(users.find(x=>x.username===user)){ document.getElementById('registerMsg').textContent='Username already exists'; return; }
  // photo handling (store data URL)
  const input = document.getElementById('regPhoto');
  const reader = new FileReader();
  reader.onload = ()=>{
    users.push({id:Date.now(),name, email, phone, username:user, password:pass, photo: reader.result});
    saveUsers(users);
    document.getElementById('registerMsg').textContent='Registered. You can sign in now.';
    document.getElementById('registerModal').classList.add('hidden');
  };
  if(input.files[0]) reader.readAsDataURL(input.files[0]); else { reader.onload(); }
});

document.getElementById('doSignin').addEventListener('click', ()=>{
  const user=document.getElementById('signinUser').value.trim();
  const pass=document.getElementById('signinPass').value;
  const users=loadUsers();
  const found = users.find(u=>u.username===user && u.password===pass);
  if(found){ setCurrent(found); document.getElementById('signinModal').classList.add('hidden'); document.getElementById('signinMsg').textContent=''; }
  else document.getElementById('signinMsg').textContent='Invalid credentials';
});

document.getElementById('profileBtn').addEventListener('click', ()=>{
  const u = currentUser();
  if(!u){ alert('Not signed in'); return; }
  const v = document.getElementById('profileView');
  v.innerHTML = `<p><strong>${u.name}</strong></p><p>${u.email||''}</p><p>${u.phone||''}</p><div>${u.photo?'<img src="'+u.photo+'" style="max-width:100%"/>':''}</div>`;
  document.getElementById('profileDrawer').classList.remove('hidden');
});
document.getElementById('closeProfile').addEventListener('click', ()=>document.getElementById('profileDrawer').classList.add('hidden'));
document.getElementById('logoutBtn').addEventListener('click', ()=>{ localStorage.removeItem('gnos_current'); updateUIForAuth(); document.getElementById('profileDrawer').classList.add('hidden'); });

updateUIForAuth();

// Get Started scroll to services
document.getElementById('getStarted').addEventListener('click', ()=> document.getElementById('services').scrollIntoView({behavior:'smooth'}));

// service open buttons
document.querySelectorAll('.open-service').forEach(b=>{
  b.addEventListener('click', (e)=>{
    const svc = e.target.closest('.service').dataset.service;
    const user = currentUser();
    if(!user){
      alert('Service is for registered GN users only. Please register or sign in.');
      return;
    }
    // route to service pages / modals
    if(svc==='verification'){
      // open elections site embedded in new tab
      window.open('verification.html','_blank');
    } else if(svc==='person_registration'){
      window.open('person_registration.html','_blank');
    } else if(svc==='character'){
      window.open('character_certificate.html','_blank');
    }
  });
});
