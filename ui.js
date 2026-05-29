// --- ALL PREVIOUS UI.JS CONTENT REMAINS IDENTICAL HERE ---

// =========================================================
// 🛡️ JOB COVER STEALTH SYSTEM
// =========================================================

let currentJobIndex = 0;
let holdTimer = null;
let holdTriggered = false;

document.addEventListener('DOMContentLoaded', () => {
    initJobCover();
});

function initJobCover() {
    renderJobCard(currentJobIndex);
    
    const rejectBtn = document.getElementById('btn-reject-job');
    const acceptBtn = document.getElementById('btn-accept-job');

    // Prevent context menus on mobile devices for the stealth hold
    rejectBtn.oncontextmenu = (e) => e.preventDefault();

    const startHold = (e) => {
        if(e.cancelable) e.preventDefault();
        holdTriggered = false;
        holdTimer = setTimeout(() => {
            holdTriggered = true;
            unlockSite();
        }, 3000); // 3-second stealth unlock
    };

    const endHold = (e) => {
        if(e.cancelable) e.preventDefault();
        if(holdTimer) clearTimeout(holdTimer);
        // If it was just a regular click/tap and not held for 3 seconds
        if (!holdTriggered) {
            handleJobAction('reject');
        }
    };

    // Bind hold listeners
    rejectBtn.addEventListener('mousedown', startHold);
    rejectBtn.addEventListener('touchstart', startHold, {passive: false});
    
    rejectBtn.addEventListener('mouseup', endHold);
    rejectBtn.addEventListener('touchend', endHold, {passive: false});
    rejectBtn.addEventListener('mouseleave', () => { if(holdTimer) clearTimeout(holdTimer); });
    rejectBtn.addEventListener('touchcancel', () => { if(holdTimer) clearTimeout(holdTimer); });

    // Accept button just acts normally
    acceptBtn.onclick = () => handleJobAction('accept');
    
    // --- CHAT BUTTON SLIDE-TO-HIDE LOGIC ---
    const chatSendBtn = document.getElementById('chat-send-btn');
    let startX, startY;
    let isSliding = false;

    const startSlide = (e) => {
        isSliding = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
    };

    const endSlide = (e) => {
        if(!isSliding) return;
        isSliding = false;
        const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        
        // Calculate slide distance
        const dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        
        if (dist > 15) { // Threshold for activation
            activateCover();
        } else {
            // Normal click
            if (typeof sendChat === 'function') sendChat();
        }
    };

    chatSendBtn.addEventListener('mousedown', startSlide);
    chatSendBtn.addEventListener('touchstart', startSlide, {passive: true});
    chatSendBtn.addEventListener('mouseup', endSlide);
    chatSendBtn.addEventListener('touchend', endSlide, {passive: true});
}

function renderJobCard(index) {
    const container = document.getElementById('job-card-container');
    const job = mockJobsList[index % mockJobsList.length];
    
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <h2>${job.title}</h2>
        <span class="loc">📍 ${job.location} | ${job.salary}</span>
        <p>${job.desc}</p>
    `;
    
    container.innerHTML = '';
    container.appendChild(card);
    
    // Slide in from right
    card.animate([
        { transform: 'translateX(100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
    ], { duration: 300, fill: 'forwards', easing: 'ease-out' });
}

function handleJobAction(action) {
    const toast = document.getElementById('job-toast');
    if(action === 'accept') toast.innerText = "Job application submitted.";
    else toast.innerText = "You rejected this job.";
    
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 1500);

    const oldCard = document.querySelector('.job-card');
    if(oldCard) {
        // Slide out to left
        oldCard.animate([
            { transform: 'translateX(0)', opacity: 1 },
            { transform: 'translateX(-100%)', opacity: 0 }
        ], { duration: 300, fill: 'forwards', easing: 'ease-in' }).onfinish = () => {
            currentJobIndex++;
            renderJobCard(currentJobIndex);
        };
    }
}

function unlockSite() {
    const overlay = document.getElementById('job-cover-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 300);
}

function activateCover() {
    const overlay = document.getElementById('job-cover-overlay');
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 10);
    
    // 🚨 PANIC MUTE PROTOCOL 🚨
    
    // 1. Mute YouTube
    if (typeof ytPlayer !== 'undefined' && ytPlayer && typeof ytPlayer.mute === 'function') {
        ytPlayer.mute();
    }
    
    // 2. Mute Native Player / IFrames
    const mainVid = document.getElementById('main-video');
    if (mainVid) mainVid.muted = true;
    if (typeof adjustVolume === 'function') adjustVolume(0);
    
    // 3. Mute Incoming Remote Stream (This ensures the guest's voice is instantly cut)
    const remoteVid = document.getElementById('remote-video');
    if (remoteVid) remoteVid.muted = true;
}
