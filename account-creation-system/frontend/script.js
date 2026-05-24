const API_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
        
        // Add click animation
        createRippleEffect(togglePassword);
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Add button click animation
        createRippleEffect(submitBtn);
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate form
        if (!fullName || !username || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            animateInputError(document.getElementById('confirmPassword'));
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            animateInputError(document.getElementById('password'));
            return;
        }
        
        if (!terms) {
            showToast('Please agree to the Terms & Conditions', 'error');
            animateCheckbox(document.getElementById('terms'));
            return;
        }
        
        // Show loading state
        setLoading(true);
        
        try {
            // Send registration request
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullName,
                    username: username,
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast(data.message, 'success');
                // Animate success
                animateSuccess();
                // Reset form after success
                setTimeout(() => {
                    form.reset();
                }, 2000);
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Connection error. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    });
    
    // Real-time validation
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    
    usernameInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length < 3 && value.length > 0) {
            showFieldHint(usernameInput, 'Username must be at least 3 characters');
        } else {
            hideFieldHint(usernameInput);
        }
    });
    
    emailInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            showFieldHint(emailInput, 'Enter a valid email address');
        } else {
            hideFieldHint(emailInput);
        }
    });
    
    function setLoading(loading) {
        if (loading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        } else {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }
    
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('.toast-content i');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        toastIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function animateInputError(input) {
        input.style.borderColor = '#f44336';
        input.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            input.style.borderColor = '#e0e0e0';
            input.style.animation = '';
        }, 500);
    }
    
    function animateCheckbox(checkbox) {
        checkbox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            checkbox.style.animation = '';
        }, 500);
    }
    
    function animateSuccess() {
        const card = document.querySelector('.registration-card');
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'slideIn 0.6s ease-out';
    }
    
    function showFieldHint(input, message) {
        let hint = input.parentElement.querySelector('.field-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'field-hint';
            hint.style.cssText = `
                position: absolute;
                bottom: -20px;
                left: 12px;
                font-size: 11px;
                color: #f44336;
                animation: fadeIn 0.3s;
            `;
            input.parentElement.appendChild(hint);
        }
        hint.textContent = message;
    }
    
    function hideFieldHint(input) {
        const hint = input.parentElement.querySelector('.field-hint');
        if (hint) {
            hint.remove();
        }
    }
    
    function createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${rect.width / 2 - size / 2}px`;
        ripple.style.top = `${rect.height / 2 - size / 2}px`;
        ripple.style.position = 'absolute';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add CSS keyframes for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
