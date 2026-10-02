const form = document.getElementById("applicationForm");
const steps = [...document.querySelectorAll(".form-step")];
const stepLabels = [...document.querySelectorAll(".step")];
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
let current = 1;

const deadline = new Date("2026-12-31T23:59:59+03:00");
document.getElementById("deadlineText").textContent = deadline.toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});

function fieldsFor(n){
  return [...steps[n-1].querySelectorAll("input[required],select[required]")];
}
function validateStep(n){
  let ok=true;
  fieldsFor(n).forEach(el=>{
    if(!el.checkValidity()){ el.reportValidity(); ok=false; }
  });
  if(n===3){
    const file=document.getElementById("cv").files[0];
    if(file && file.size>5*1024*1024){ alert("CV must be 5 MB or smaller."); ok=false; }
  }
  return ok;
}
function updateProgress(){
  const values = ["fullName","country","gender","email","mobile","cv","consent"];
  const complete = values.filter(id=>{
    const el=document.getElementById(id);
    return el && ((el.type==="checkbox" && el.checked) || (el.type==="file" && el.files.length) || (el.value && el.value.trim()));
  }).length;
  const pct = Math.round((complete/values.length)*100);
  progressBar.style.width=pct+"%"; progressText.textContent=pct+"%";
}
function show(n){
  current=n;
  steps.forEach((s,i)=>s.classList.toggle("active",i===n-1));
  stepLabels.forEach((s,i)=>s.classList.toggle("active",i<=n-1));
  if(n===4) buildReview();
  updateProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>{
  if(validateStep(current) && current<4) show(current+1);
}));
document.querySelectorAll(".back").forEach(b=>b.addEventListener("click",()=>show(current-1)));

function buildReview(){
  const file=document.getElementById("cv").files[0];
  document.getElementById("review").innerHTML = `
    <div><span>Full name</span><strong>${esc(fullName.value)}</strong></div>
    <div><span>Country</span><strong>${esc(country.value)}</strong></div>
    <div><span>Gender</span><strong>${esc(gender.value)}</strong></div>
    <div><span>Email</span><strong>${esc(email.value)}</strong></div>
    <div><span>Mobile</span><strong>${esc(mobile.value)}</strong></div>
    <div><span>CV</span><strong>${file ? esc(file.name) : "Not selected"}</strong></div>`;
}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

document.getElementById("cv").addEventListener("change",e=>{
  const f=e.target.files[0]; document.getElementById("fileName").textContent=f?f.name:"No file selected"; updateProgress();
});
form.addEventListener("input",updateProgress);
document.getElementById("consent").addEventListener("change",updateProgress);

form.addEventListener("submit",e=>{
  e.preventDefault();
  if(!document.getElementById("consent").checked){alert("Please confirm that your information is accurate.");return;}
  const msg=document.getElementById("message");
  msg.className="message success";
  msg.textContent="Application completed successfully on this demo site. Connect this form to a backend/email service to actually send and store applications.";
  progressBar.style.width="100%"; progressText.textContent="100%";
});

const panel=document.getElementById("settingsPanel"), overlay=document.getElementById("overlay");
document.getElementById("settingsBtn").onclick=()=>{panel.classList.add("open");overlay.classList.add("show")};
document.getElementById("closeSettings").onclick=()=>{panel.classList.remove("open");overlay.classList.remove("show")};
overlay.onclick=()=>document.getElementById("closeSettings").click();
document.getElementById("feedbackBtn").onclick=()=>{
  const text=encodeURIComponent("Hello Twenty8-Production, I would like to send feedback or request help with the coding job application.");
  window.open("https://wa.me/254706756141?text="+text,"_blank");
};
document.querySelectorAll(".theme-btn").forEach(b=>b.onclick=()=>{
  document.body.classList.toggle("light",b.dataset.theme==="light");
  localStorage.setItem("theme",b.dataset.theme);
});
if(localStorage.getItem("theme")==="light")document.body.classList.add("light");

setInterval(()=>{
  const diff=deadline-new Date();
  const el=document.getElementById("countdownText");
  if(diff<=0){el.textContent="Deadline reached";return;}
  const d=Math.floor(diff/86400000), h=Math.floor(diff/3600000)%24, m=Math.floor(diff/60000)%60;
  el.textContent=`${d} days ${h} hours ${m} minutes remaining`;
},1000);

document.getElementById("year").textContent=new Date().getFullYear();
updateProgress();
