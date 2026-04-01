// ===== PASSWORD PROTECTION =====
const CORRECT_PASSWORD = "    "; // Four spaces
let isAuthenticated = false;

// DOM Elements for password modal
const passwordModal = document.getElementById('passwordModal');
const mainDashboard = document.getElementById('mainDashboard');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');

// Function to check password
function checkPassword() {
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === CORRECT_PASSWORD) {
        isAuthenticated = true;
        
        unlockBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            passwordModal.style.animation = 'modalFadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                passwordModal.style.display = 'none';
                mainDashboard.style.display = 'block';
                mainDashboard.style.animation = 'fadeInUp 0.5s ease-out';
                initializeDashboard();
                startEffects();
            }, 300);
        }, 150);
    } else {
        errorMessage.textContent = '❌ Incorrect password. Hint: Four spaces';
        errorMessage.classList.add('show');
        passwordInput.style.borderColor = '#ef4444';
        passwordInput.value = '';
        
        passwordInput.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
            passwordInput.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        }, 300);
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
}

function handleEnterPress(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
}

if (unlockBtn) {
    unlockBtn.addEventListener('click', checkPassword);
}
if (passwordInput) {
    passwordInput.addEventListener('keypress', handleEnterPress);
}

window.addEventListener('load', () => {
    if (passwordInput) {
        setTimeout(() => {
            passwordInput.focus();
        }, 100);
    }
});

const modalFadeOutStyle = document.createElement('style');
modalFadeOutStyle.textContent = `
    @keyframes modalFadeOut {
        from {
            opacity: 1;
            backdrop-filter: blur(20px);
        }
        to {
            opacity: 0;
            backdrop-filter: blur(0);
            visibility: hidden;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(modalFadeOutStyle);

// ===== ANIMATION EFFECTS =====
let fireInterval, iceInterval, dotInterval, fireworkInterval;

function startEffects() {
    fireInterval = setInterval(createFireParticle, 300);
    iceInterval = setInterval(createIceParticle, 400);
    createFloatingDots();
    dotInterval = setInterval(createFloatingDot, 2000);
    fireworkInterval = setInterval(createRandomFirework, 5000);
}

function createFireParticle() {
    const fireContainer = document.getElementById('fireContainer');
    if (!fireContainer) return;
    
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    particle.style.left = left + '%';
    particle.style.bottom = '0';
    particle.style.setProperty('--duration', duration + 's');
    particle.style.animationDuration = duration + 's';
    
    fireContainer.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

function createIceParticle() {
    const iceContainer = document.getElementById('iceContainer');
    if (!iceContainer) return;
    
    const particle = document.createElement('div');
    particle.className = 'ice-particle';
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    particle.style.left = left + '%';
    particle.style.top = '-10px';
    particle.style.setProperty('--duration', duration + 's');
    particle.style.animationDuration = duration + 's';
    
    iceContainer.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

function createFloatingDots() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createFloatingDot(), i * 200);
    }
}

function createFloatingDot() {
    const dot = document.createElement('div');
    dot.className = 'floating-dot';
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 10 + 5;
    dot.style.left = left + '%';
    dot.style.top = top + '%';
    dot.style.setProperty('--duration', duration + 's');
    dot.style.animationDuration = duration + 's';
    
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), duration * 1000);
}

// Fireworks Effect
class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.createParticles();
    }
    
    createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 3 + 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: vx,
                vy: vy,
                life: 1,
                color: this.color
            });
        }
    }
    
    update() {
        let allDead = true;
        for (let p of this.particles) {
            if (p.life > 0) {
                allDead = false;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.life -= 0.02;
            }
        }
        return !allDead;
    }
    
    draw(ctx) {
        for (let p of this.particles) {
            if (p.life > 0) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }
        }
    }
}

let fireworks = [];
let canvas, ctx;

function initFireworks() {
    canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    function animateFireworks() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const active = fireworks[i].update();
            fireworks[i].draw(ctx);
            if (!active) {
                fireworks.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateFireworks);
    }
    
    animateFireworks();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function createRandomFirework() {
    if (!canvas || !ctx) return;
    
    const colors = ['#ff6b35', '#f7931e', '#ff4500', '#ff3366', '#ff66cc', '#ffaa44'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.6;
    
    fireworks.push(new Firework(x, y, color));
}

// ===== CONFIGURATION =====
const WORK_START = { hour: 9, minute: 30 };   // 09:30 AM
const WORK_END = { hour: 16, minute: 30 };     // 04:30 PM
const LUNCH_START = { hour: 13, minute: 0 };   // 01:00 PM (Lunch Start)
const LUNCH_END = { hour: 14, minute: 0 };     // 02:00 PM (Lunch End)

// Total work minutes (lunch counts as work - 7 hours total)
const TOTAL_WORK_MINUTES = (WORK_END.hour * 60 + WORK_END.minute) - (WORK_START.hour * 60 + WORK_START.minute);

// DOM Elements
const todayDateSpan = document.getElementById("todayDate");
const statusTextSpan = document.getElementById("statusText");
const statusIcon = document.getElementById("statusIcon");
const timeRemainingDiv = document.getElementById("timeRemaining");
const timeCompletedDiv = document.getElementById("timeCompleted");
const completionRateSpan = document.getElementById("completionRate");
const progressFill = document.getElementById("progressFill");
const progressPercentSpan = document.getElementById("progressPercent");
const liveTimeSpan = document.getElementById("liveTime");
const dynamicMsgText = document.getElementById("dynamicMsgText");
const energyTipSpan = document.getElementById("energyTip");
const taskCounterSpan = document.getElementById("taskCounter");
const sessionPhaseSpan = document.getElementById("sessionPhase");
const nextAlertContainer = document.getElementById("nextAlertContainer");
const nextAlertText = document.getElementById("nextAlertText");
const lunchSection = document.getElementById("lunchSection");
const lunchCard = document.getElementById("lunchCard");
const lunchTitle = document.getElementById("lunchTitle");
const lunchMessage = document.getElementById("lunchMessage");
const lunchTimeLeft = document.getElementById("lunchTimeLeft");

let finishNotified = false;
let hourlyNotified = new Set();

// ===== UPDATED: Get current time with seconds =====
function getCurrentDateTime() {
    const now = new Date();
    return {
        minutes: now.getHours() * 60 + now.getMinutes(),
        seconds: now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
        fullDate: now
    };
}

function formatTimeWithSeconds(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ===== UPDATED: Calculate remaining seconds with current seconds precision =====
function calculateRemainingSecondsWithSeconds(currentDateTime) {
    const startTime = WORK_START.hour * 3600 + WORK_START.minute * 60;
    const endTime = WORK_END.hour * 3600 + WORK_END.minute * 60;
    const currentSeconds = currentDateTime.seconds;
    
    if (currentSeconds < startTime) {
        return endTime - startTime;
    } else if (currentSeconds >= startTime && currentSeconds <= endTime) {
        return endTime - currentSeconds;
    } else {
        return 0;
    }
}

// ===== UPDATED: Calculate completed seconds with current seconds precision =====
function calculateCompletedSecondsWithSeconds(currentDateTime) {
    const startTime = WORK_START.hour * 3600 + WORK_START.minute * 60;
    const endTime = WORK_END.hour * 3600 + WORK_END.minute * 60;
    const currentSeconds = currentDateTime.seconds;
    
    if (currentSeconds < startTime) {
        return 0;
    } else if (currentSeconds >= startTime && currentSeconds <= endTime) {
        return currentSeconds - startTime;
    } else if (currentSeconds > endTime) {
        return endTime - startTime;
    }
    return 0;
}

// Update Lunch Break UI
function updateLunchUI(currentMinutes) {
    const lunchStartMinutes = LUNCH_START.hour * 60 + LUNCH_START.minute;
    const lunchEndMinutes = LUNCH_END.hour * 60 + LUNCH_END.minute;
    
    if (currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes) {
        lunchCard.className = 'lunch-card lunch-active';
        lunchTitle.innerHTML = '🍽️ LUNCH BREAK IN PROGRESS';
        lunchMessage.innerHTML = '01:00 PM - 02:00 PM | Take a break & recharge!';
        
        const remainingLunch = lunchEndMinutes - currentMinutes;
        const hours = Math.floor(remainingLunch / 60);
        const mins = remainingLunch % 60;
        lunchTimeLeft.innerHTML = hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`;
        
        sessionPhaseSpan.innerHTML = "🍽️ LUNCH BREAK";
        energyTipSpan.innerHTML = "Enjoy your meal!";
        
        if (!window.lunchEffectInterval) {
            window.lunchEffectInterval = setInterval(() => {
                createFireParticle();
                createIceParticle();
            }, 200);
        }
    } else if (currentMinutes < lunchStartMinutes && currentMinutes >= WORK_START.hour * 60 + WORK_START.minute) {
        lunchCard.className = 'lunch-card lunch-upcoming';
        lunchTitle.innerHTML = '🍽️ Lunch Break Coming Soon';
        lunchMessage.innerHTML = '01:00 PM - 02:00 PM | Prepare for break';
        
        const timeToLunch = lunchStartMinutes - currentMinutes;
        if (timeToLunch > 0 && timeToLunch <= 60) {
            lunchTimeLeft.innerHTML = `Starts in ${timeToLunch} min`;
        } else {
            lunchTimeLeft.innerHTML = `Starts at 01:00 PM`;
        }
    } else if (currentMinutes >= lunchEndMinutes) {
        lunchCard.className = 'lunch-card lunch-ended';
        lunchTitle.innerHTML = '✅ Lunch Break Completed';
        lunchMessage.innerHTML = '01:00 PM - 02:00 PM | Refreshed & ready to work!';
        lunchTimeLeft.innerHTML = 'Break finished';
        
        if (window.lunchEffectInterval) {
            clearInterval(window.lunchEffectInterval);
            window.lunchEffectInterval = null;
        }
    } else {
        lunchCard.className = 'lunch-card lunch-upcoming';
        lunchTitle.innerHTML = '🍽️ Lunch Break';
        lunchMessage.innerHTML = '01:00 PM - 02:00 PM';
        lunchTimeLeft.innerHTML = 'After morning session';
    }
}

// Show Notification
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <i class="fas ${type === 'finish' ? 'fa-trophy' : type === 'hour-left' ? 'fa-heart' : 'fa-bell'}"></i>
        <div class="notification-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    if (canvas && ctx) {
        setTimeout(() => {
            createRandomFirework();
        }, 100);
    }
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// Check and send hourly notifications
function checkHourlyNotifications(remainingMinutes, status) {
    const currentDateTime = getCurrentDateTime();
    const endMinutes = WORK_END.hour * 60 + WORK_END.minute;
    
    if (!finishNotified && status === "✅ Finished") {
        finishNotified = true;
        showNotification("🎉 Work Complete! 🎉", "You've successfully completed your workday! Time to relax and celebrate! 🌟", "finish");
        
        if (nextAlertContainer) {
            nextAlertContainer.style.display = "flex";
            nextAlertText.innerHTML = "✨ Work Day Complete! Great Job! ✨";
        }
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createRandomFirework(), i * 500);
        }
    }
    
    if (currentDateTime.minutes >= endMinutes) {
        if (nextAlertContainer) {
            nextAlertContainer.style.display = "flex";
            if (!finishNotified) {
                nextAlertText.innerHTML = "🏆 Work Day Complete! Time to Rest 🏆";
            }
        }
    } else {
        if (nextAlertContainer) {
            nextAlertContainer.style.display = "none";
        }
    }
    
    if (status === "🔥 Working" && remainingMinutes > 0) {
        for (let i = 1; i <= 7; i++) {
            const notificationKey = `${i}_hour_left`;
            if (!hourlyNotified.has(notificationKey) && remainingMinutes <= i * 60 && remainingMinutes > (i-1) * 60) {
                hourlyNotified.add(notificationKey);
                const remainingHours = Math.floor(remainingMinutes / 60);
                const remainingMins = Math.floor(remainingMinutes % 60);
                if (i === 1) {
                    showNotification("😍 1 Hour Remaining!", `Only ${remainingMins} minutes left! You're almost there! Keep pushing! 💪`, "hour-left");
                } else {
                    showNotification(`⏰ ${i} Hours Left`, `${remainingHours} hours and ${remainingMins} minutes remaining. Stay focused! 🎯`, "hour-left");
                }
                break;
            }
        }
    }
}

// Update Task Counter
function updateTaskCounter(percentage) {
    if (percentage === 0) {
        taskCounterSpan.innerHTML = "Ready to start";
    } else if (percentage < 33) {
        taskCounterSpan.innerHTML = "📝 1/3 completed";
    } else if (percentage < 66) {
        taskCounterSpan.innerHTML = "✅ 2/3 completed";
    } else if (percentage < 100) {
        taskCounterSpan.innerHTML = "🎯 Almost there!";
    } else {
        taskCounterSpan.innerHTML = "🏆 All done!";
    }
}

// Update Session Phase
function updateSessionPhase(currentMinutes) {
    const startMinutes = WORK_START.hour * 60 + WORK_START.minute;
    const lunchStartMinutes = LUNCH_START.hour * 60 + LUNCH_START.minute;
    const lunchEndMinutes = LUNCH_END.hour * 60 + LUNCH_END.minute;
    const endMinutes = WORK_END.hour * 60 + WORK_END.minute;
    
    if (currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes) {
        return;
    }
    
    if (currentMinutes < startMinutes) {
        sessionPhaseSpan.innerHTML = "🌅 Pre-Work";
        energyTipSpan.innerHTML = "Prepare for the day";
    } else if (currentMinutes >= startMinutes && currentMinutes < lunchStartMinutes) {
        const minutesIn = currentMinutes - startMinutes;
        if (minutesIn < 90) {
            sessionPhaseSpan.innerHTML = "🚀 Morning Sprint";
            energyTipSpan.innerHTML = "High energy!";
        } else {
            sessionPhaseSpan.innerHTML = "💪 Deep Work";
            energyTipSpan.innerHTML = "Stay focused";
        }
    } else if (currentMinutes >= lunchEndMinutes && currentMinutes < endMinutes) {
        const minutesAfterLunch = currentMinutes - lunchEndMinutes;
        if (minutesAfterLunch < 90) {
            sessionPhaseSpan.innerHTML = "🍽️ Post-Lunch Flow";
            energyTipSpan.innerHTML = "Keep momentum";
        } else {
            sessionPhaseSpan.innerHTML = "🎯 Final Push";
            energyTipSpan.innerHTML = "Finish strong!";
        }
    } else if (currentMinutes > endMinutes) {
        sessionPhaseSpan.innerHTML = "🏁 Day Complete";
        energyTipSpan.innerHTML = "Well done!";
    }
}

// ===== MAIN UPDATE FUNCTION - NOW WITH REAL-TIME SECONDS =====
function updateDashboard() {
    const currentDateTime = getCurrentDateTime();
    const currentMinutes = currentDateTime.minutes;
    const startMinutes = WORK_START.hour * 60 + WORK_START.minute;
    const lunchStartMinutes = LUNCH_START.hour * 60 + LUNCH_START.minute;
    const lunchEndMinutes = LUNCH_END.hour * 60 + LUNCH_END.minute;
    const endMinutes = WORK_END.hour * 60 + WORK_END.minute;
    
    const isLunchTime = currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes;
    
    updateLunchUI(currentMinutes);
    
    let status = "";
    let statusColor = "";
    if (currentMinutes < startMinutes) {
        status = "⏳ Not Started";
        statusColor = "#facc15";
    } else if (isLunchTime) {
        status = "🍽️ Lunch Break";
        statusColor = "#f97316";
    } else if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        status = "🔥 Working";
        statusColor = "#4ade80";
    } else {
        status = "✅ Finished";
        statusColor = "#f87171";
    }
    statusTextSpan.innerText = status;
    statusIcon.style.color = statusColor;
    
    // Calculate with SECONDS precision
    const remainingSeconds = calculateRemainingSecondsWithSeconds(currentDateTime);
    const completedSeconds = calculateCompletedSecondsWithSeconds(currentDateTime);
    
    // Display both with HH:MM:SS format - NOW UPDATES EVERY SECOND
    timeRemainingDiv.innerText = formatTimeWithSeconds(remainingSeconds);
    timeCompletedDiv.innerText = formatTimeWithSeconds(completedSeconds);
    
    // Tooltips for detailed info
    timeRemainingDiv.title = `${Math.floor(remainingSeconds / 3600)} hours, ${Math.floor((remainingSeconds % 3600) / 60)} minutes, ${remainingSeconds % 60} seconds remaining`;
    timeCompletedDiv.title = `${Math.floor(completedSeconds / 3600)} hours, ${Math.floor((completedSeconds % 3600) / 60)} minutes, ${completedSeconds % 60} seconds completed`;
    
    let percentage = 0;
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        percentage = (completedSeconds / (TOTAL_WORK_MINUTES * 60)) * 100;
    } else if (currentMinutes > endMinutes) {
        percentage = 100;
    }
    percentage = Math.min(100, Math.max(0, percentage));
    progressFill.style.width = `${percentage}%`;
    progressPercentSpan.innerText = `${Math.floor(percentage)}%`;
    completionRateSpan.innerText = `${Math.floor(percentage)}%`;
    
    updateSessionPhase(currentMinutes);
    updateTaskCounter(percentage);
    
    if (isLunchTime) {
        dynamicMsgText.innerText = "🍽️ Enjoy your lunch break from 1:00 PM to 2:00 PM! Recharge and come back stronger! 🌟";
    } else if (percentage === 0 && currentMinutes < startMinutes) {
        dynamicMsgText.innerText = "Ready to begin? 💪";
    } else if (percentage > 0 && percentage < 100 && status === "🔥 Working") {
        const remainingHours = Math.floor(remainingSeconds / 3600);
        const remainingMins = Math.floor((remainingSeconds % 3600) / 60);
        const remainingSecs = remainingSeconds % 60;
        dynamicMsgText.innerText = `Keep going! ${remainingHours}h ${remainingMins}m ${remainingSecs}s remaining! 🌟`;
    } else if (percentage >= 99.9) {
        dynamicMsgText.innerText = "Amazing work! Day complete! 🏆";
    }
    
    checkHourlyNotifications(remainingSeconds / 60, status);
}

function updateLiveClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    liveTimeSpan.innerText = timeString;
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayDateSpan.innerHTML = `<i class="fas fa-calendar-alt"></i> ${now.toLocaleDateString('en-US', options)}`;
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(139, 92, 246, ${Math.random() * 0.3})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `float ${Math.random() * 10 + 5}s infinite linear`;
        particlesContainer.appendChild(particle);
    }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        from { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        to { transform: translateY(-100vh) rotate(360deg); opacity: 0.5; }
    }
`;
document.head.appendChild(particleStyle);

function initializeDashboard() {
    updateDate();
    updateDashboard();
    updateLiveClock();
    createParticles();
    initFireworks();
    
    setInterval(updateDashboard, 1000);
    setInterval(updateLiveClock, 1000);
}

document.addEventListener('DOMContentLoaded', () => {});

// ===== SPARKLE CURSOR EFFECT =====
let lastX = 0, lastY = 0;
let sparkleInterval;
let isMouseMoving = false;

function createSparkle(x, y) {
    // Randomly choose sparkle type
    const type = Math.random();
    let element;
    
    if (type < 0.6) {
        // Regular sparkle
        element = document.createElement('div');
        element.className = 'sparkle';
        const size = Math.random() * 8 + 4;
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.left = (x - size/2) + 'px';
        element.style.top = (y - size/2) + 'px';
    } else if (type < 0.8) {
        // Star sparkle (✨)
        element = document.createElement('div');
        element.className = 'star';
        element.style.left = (x - 6) + 'px';
        element.style.top = (y - 6) + 'px';
    } else {
        // Diamond sparkle
        element = document.createElement('div');
        element.className = 'diamond-sparkle';
        const size = Math.random() * 8 + 6;
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.left = (x - size/2) + 'px';
        element.style.top = (y - size/2) + 'px';
    }
    
    document.body.appendChild(element);
    
    // Remove after animation
    setTimeout(() => {
        if (element && element.remove) {
            element.remove();
        }
    }, 800);
}

function createSparkleTrail(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    // Create multiple sparkles for a richer effect
    const sparkleCount = Math.random() * 3 + 2; // 2-5 sparkles
    
    for (let i = 0; i < sparkleCount; i++) {
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        setTimeout(() => {
            createSparkle(x + offsetX, y + offsetY);
        }, i * 30);
    }
    
    // Add a larger star occasionally
    if (Math.random() < 0.3) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = (x - 8) + 'px';
            star.style.top = (y - 8) + 'px';
            star.style.width = '16px';
            star.style.height = '16px';
            star.style.animation = 'starAnim 0.6s ease-out forwards';
            star.innerHTML = '⭐';
            star.style.background = 'none';
            star.style.fontSize = '16px';
            star.style.display = 'flex';
            star.style.alignItems = 'center';
            star.style.justifyContent = 'center';
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 600);
        }, 50);
    }
}

// Throttled mouse move handler for better performance
let lastMoveTime = 0;
function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastMoveTime > 30) { // ~30fps for trail
        lastMoveTime = now;
        createSparkleTrail(e);
    }
    lastX = e.clientX;
    lastY = e.clientY;
}

// Continuous sparkle effect when mouse is idle
function startIdleSparkles() {
    let lastSparkleTime = 0;
    sparkleInterval = setInterval(() => {
        if (!isMouseMoving && lastX && lastY) {
            const now = Date.now();
            if (now - lastSparkleTime > 800) {
                lastSparkleTime = now;
                createSparkle(lastX, lastY);
            }
        }
    }, 100);
}

// Track mouse movement status
document.addEventListener('mousemove', (e) => {
    isMouseMoving = true;
    handleMouseMove(e);
    clearTimeout(window.mouseStopTimeout);
    window.mouseStopTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 300);
});

// Initialize sparkle cursor
function initSparkleCursor() {
    startIdleSparkles();
    
    // Add click sparkle effect
    document.addEventListener('click', (e) => {
        // Create explosion of sparkles on click
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const offsetX = Math.cos(angle) * 20;
            const offsetY = Math.sin(angle) * 20;
            setTimeout(() => {
                createSparkle(e.clientX + offsetX, e.clientY + offsetY);
            }, i * 20);
        }
        
        // Add a big star on click
        const bigStar = document.createElement('div');
        bigStar.className = 'star';
        bigStar.style.left = (e.clientX - 15) + 'px';
        bigStar.style.top = (e.clientY - 15) + 'px';
        bigStar.style.width = '30px';
        bigStar.style.height = '30px';
        bigStar.style.animation = 'starAnim 0.5s ease-out forwards';
        bigStar.innerHTML = '🌟';
        bigStar.style.background = 'none';
        bigStar.style.fontSize = '30px';
        bigStar.style.display = 'flex';
        bigStar.style.alignItems = 'center';
        bigStar.style.justifyContent = 'center';
        document.body.appendChild(bigStar);
        setTimeout(() => bigStar.remove(), 500);
    });
}

// Call this in your initializeDashboard function
const originalInitSparkle = initializeDashboard;
initializeDashboard = function() {
    originalInitSparkle();
    initSparkleCursor();
};

