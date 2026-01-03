function lsGet(k,f){try{return JSON.parse(localStorage.getItem(k))||f;}catch{return f;}}
function lsSet(k,v){localStorage.setItem(k,JSON.stringify(v));}
const LS_ACCOUNT='mc_account', LS_CONTACTS='mc_contacts';
const accountForm=document.getElementById('accountForm');
const mainApp=document.getElementById('mainApp');
const flashlight=document.getElementById('flashlight');

document.getElementById('loginBtn').onclick=()=>{const name=loginName.value.trim(),pwd=loginPassword.value.trim();const acc=lsGet(LS_ACCOUNT,null);if(acc&&acc.name===name&&acc.password===pwd){enterApp();}else alert('Invalid credentials');};
document.getElementById('createBtn').onclick=()=>{const name=createName.value.trim(),pwd=createPassword.value.trim();if(!name||!pwd)return alert('Fill all');lsSet(LS_ACCOUNT,{name,password:pwd});enterApp();};
document.getElementById('showCreateBtn').onclick=()=>{loginSection.style.display='none';createSection.style.display='block';};
document.getElementById('showLoginBtn').onclick=()=>{createSection.style.display='none';loginSection.style.display='block';};
function enterApp(){accountForm.style.display='none';mainApp.style.display='block';document.body.classList.add('main-bg');}
document.getElementById('logoutBtn').onclick=()=>{mainApp.style.display='none';accountForm.style.display='block';document.body.classList.remove('main-bg');};

function getContacts(){return lsGet(LS_CONTACTS,[]);}
function saveContacts(a){lsSet(LS_CONTACTS,a);renderContacts();}
function renderContacts(){const arr=getContacts();contactsList.innerHTML='';if(!arr.length){contactsList.innerHTML='<div>📭 No contacts</div>';return;}arr.forEach((c,i)=>contactsList.innerHTML+=`<div class='contact-item'><div>👤 ${c.name}<br>📞 ${c.number}</div><div><a href='tel:${c.number}'>📞</a> <button onclick='removeContact(${i})'>❌</button></div></div>`);}
function removeContact(i){const a=getContacts();a.splice(i,1);saveContacts(a);}
document.getElementById('addContactBtn').onclick=()=>{const n=newContactName.value.trim(),num=newContactNumber.value.trim();if(!n||!num)return alert('Fill details');const a=getContacts();a.push({name:n,number:num});saveContacts(a);};
document.getElementById('clearContactsBtn').onclick=()=>{localStorage.removeItem(LS_CONTACTS);renderContacts();alert('🧹 All contacts cleared!');};
renderContacts();

document.getElementById('sosLocationBtn').onclick=()=>{
  const contacts=getContacts();
  if(!contacts.length)return alert('⚠️ No contacts saved!');
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat=pos.coords.latitude,lon=pos.coords.longitude;
      const mapLink=`https://www.google.com/maps?q=${lat},${lon}`;
      const msg=encodeURIComponent(`🚨 HELP! I'm in danger!\n📍 My location: ${mapLink}`);
      contacts.forEach(c=>{window.open(`sms:${c.number}?body=${msg}`,'_blank');});
      alert('✅ SOS + Location ready to send!');
    });
  }else alert('Geolocation not supported.');
};

const fakeCallScreen=document.getElementById('fake-call-screen');
const answeredCall=document.getElementById('answered-call');
const momVoice=document.getElementById('momVoice');
document.getElementById('fakeCallBtn').onclick=()=>fakeCallScreen.style.display='flex';
document.getElementById('answerBtn').onclick=()=>{fakeCallScreen.style.display='none';answeredCall.style.display='flex';momVoice.currentTime=0;momVoice.play().catch(()=>alert("Please tap screen to allow audio playback."));};
document.getElementById('declineBtn').onclick=()=>fakeCallScreen.style.display='none';
document.getElementById('endBtn').onclick=()=>{answeredCall.style.display='none';momVoice.pause();momVoice.currentTime=0;};

const sirenSound=document.getElementById('sirenSound');
let lastX=null,lastY=null,lastZ=null,lastShake=0;let sirenActive=false;
function startSiren(){
  if(sirenActive)return;
  sirenActive=true;
  flashlight.classList.add('flashlight-on');
  sirenSound.currentTime=0;
  sirenSound.play().catch(()=>alert("Tap screen to enable audio!"));
  navigator.vibrate?.([500,200,500,200,500]);
  setTimeout(stopSiren,15000);
}
function stopSiren(){
  sirenActive=false;
  flashlight.classList.remove('flashlight-on');
  sirenSound.pause();
  sirenSound.currentTime=0;
}
window.addEventListener('devicemotion',e=>{
  const a=e.accelerationIncludingGravity;
  if(!a.x)return;
  if(lastX!==null){
    const delta=Math.abs(a.x-lastX)+Math.abs(a.y-lastY)+Math.abs(a.z-lastZ);
    if(delta>25){
      const now=Date.now();
      if(now-lastShake>3000){
        lastShake=now;
        startSiren();
        alert('⚠️ Shake detected! Siren activated!');
      }
    }
  }
  lastX=a.x;lastY=a.y;lastZ=a.z;
});
