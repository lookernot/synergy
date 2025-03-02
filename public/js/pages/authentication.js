const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const sendCodeBtn = document.querySelector('.btn-send-code');

// Form switching
document.querySelectorAll('.btn-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.dataset.form === 'signup') {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            // Re-initialize send code button after form switch
            initializeSendCode();
        } else {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    });
});

function initializeSendCode() {
    const sendCodeBtn = document.querySelector('.btn-send-code');
    const verificationGroup = document.querySelector('.verification-group');
    
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', () => {
            verificationGroup.classList.remove('hidden');
            sendCodeBtn.disabled = true;
            startTimer();
        });
    }
}

function startTimer() {
    let timeLeft = 120;
    const timerEl = document.querySelector('.timer');
    const resendBtn = document.querySelector('.resend-code');
    const sendCodeBtn = document.querySelector('.btn-send-code');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (--timeLeft < 0) {
            clearInterval(timer);
            resendBtn.classList.remove('disabled');
            sendCodeBtn.disabled = false;
            timerEl.textContent = '';
        }
    }, 1000);

    // Add resend code functionality
    resendBtn.addEventListener('click', () => {
        if (!resendBtn.classList.contains('disabled')) {
            timeLeft = 120;
            resendBtn.classList.add('disabled');
            sendCodeBtn.disabled = true;
        }
    });
}

// Initialize send code functionality on page load
initializeSendCode();
