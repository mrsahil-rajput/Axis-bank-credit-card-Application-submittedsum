document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('limitIncreaseForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const mobileInput = document.getElementById('mobile');
    const requestedLimitInput = document.getElementById('requestedLimit');
    const currentLimitInput = document.getElementById('currentLimit');
    const requestReasonSelect = document.getElementById('requestReason');
    const otherReasonGroup = document.getElementById('otherReasonGroup');
    const otherReasonInput = document.getElementById('otherReason');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');

    // Card number validation
    cardNumberInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '').substr(0, 16);
    });

    // Mobile number validation
    mobileInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '').substr(0, 10);
    });

    // Handle reason selection
    requestReasonSelect.addEventListener('change', function() {
        otherReasonGroup.style.display = this.value === 'other' ? 'block' : 'none';
        if (this.value === 'other') {
            otherReasonInput.required = true;
        } else {
            otherReasonInput.required = false;
            otherReasonInput.value = '';
        }
    });

    // Photo preview
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                alert('Photo size must be less than 2MB');
                this.value = '';
                photoPreview.style.display = 'none';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Validate requested limit
    requestedLimitInput.addEventListener('input', function() {
        const currentLimit = parseInt(currentLimitInput.value) || 0;
        const requestedLimit = parseInt(this.value) || 0;
        const creditScore = parseInt(document.getElementById('creditScore').value) || 0;
        const cardAge = parseInt(document.getElementById('cardAge').value) || 0;

        if (requestedLimit <= currentLimit) {
            this.setCustomValidity('Requested limit must be greater than current limit');
        } else if (requestedLimit > currentLimit * 3) {
            this.setCustomValidity('Requested limit cannot be more than 3 times your current limit');
        } else if (creditScore < 700 && requestedLimit > currentLimit * 1.5) {
            this.setCustomValidity('With credit score below 700, maximum limit increase is 50%');
        } else if (cardAge < 12 && requestedLimit > currentLimit * 2) {
            this.setCustomValidity('Cards less than 1 year old can only get up to 2x limit increase');
        } else {
            this.setCustomValidity('');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const income = parseInt(document.getElementById('income').value);
        const requestedLimit = parseInt(requestedLimitInput.value);
        const creditScore = parseInt(document.getElementById('creditScore').value);
        const cardAge = parseInt(document.getElementById('cardAge').value);
        const paymentHistory = document.getElementById('paymentHistory').value;

        if (requestedLimit > income * 0.4) {
            alert('Requested limit cannot exceed 40% of your annual income');
            return;
        }

        if (creditScore < 650) {
            alert('Sorry, minimum credit score of 650 is required for limit increase');
            return;
        }

        if (cardAge < 6) {
            alert('Sorry, card should be at least 6 months old for limit increase');
            return;
        }

        if (paymentHistory === 'poor') {
            alert('Sorry, good payment history is required for limit increase');
            return;
        }

        // Collect form data
        const formData = {
            cardNumber: cardNumberInput.value,
            name: document.getElementById('name').value,
            income: income,
            occupation: document.getElementById('occupation').value,
            currentLimit: parseInt(currentLimitInput.value),
            requestedLimit: requestedLimit,
            mobile: mobileInput.value,
            email: document.getElementById('email').value,
            creditScore: creditScore,
            cardAge: cardAge,
            paymentHistory: paymentHistory,
            cardUsage: document.getElementById('cardUsage').value,
            requestReason: requestReasonSelect.value,
            otherReason: otherReasonInput.value
        };

        // Show success modal
        document.getElementById('successModal').style.display = 'block';
        
        // Reset form
        form.reset();
        photoPreview.style.display = 'none';
        otherReasonGroup.style.display = 'none';
    });
});

// Close modal
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Service Card Click Handlers
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevent click if the click was on the button
        if (e.target.classList.contains('action-btn')) {
            e.stopPropagation();
            return;
        }
        
        const href = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        navigateToService(href.replace('#', ''));
    });
});

// Action Button Click Handlers
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const service = this.closest('.service-card').getAttribute('onclick').match(/'([^']+)'/)[1];
        handleServiceAction(service.replace('#', ''));
    });
});

function navigateToService(service) {
    switch(service) {
        case 'rewards':
            window.location.href = 'rewards.html';
            break;
        case 'limit-increase':
            window.location.href = 'limit-increase.html';
            break;
        case 'protection':
            window.location.href = 'protection.html';
            break;
        case 'activation':
            window.location.href = 'activation.html';
            break;
        case 'loan':
            window.location.href = 'loan.html';
            break;
        case 'online-usage':
            window.location.href = 'online-usage.html';
            break;
    }
}

function handleServiceAction(service) {
    switch(service) {
        case 'rewards':
            alert('Redirecting to rewards redemption page...');
            break;
        case 'limit-increase':
            alert('Opening limit increase application form...');
            break;
        case 'protection':
            alert('Opening card protection services...');
            break;
        case 'activation':
            alert('Opening card activation form...');
            break;
        case 'loan':
            alert('Opening loan application form...');
            break;
        case 'online-usage':
            alert('Opening online usage settings...');
            break;
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        document.querySelector(href).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to nav links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Modal Functions
function openModal(modalContent) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => document.body.removeChild(modalOverlay);
    
    modal.appendChild(closeButton);
    modal.appendChild(modalContent);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
}

// Limit Increase Application
function openLimitIncrease() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Credit Limit Increase Application</h2>
        <form id="limitIncreaseForm" onsubmit="handleLimitIncrease(event)">
            <div class="form-group">
                <label for="currentIncome">Current Monthly Income</label>
                <input type="number" id="currentIncome" required>
            </div>
            <div class="form-group">
                <label for="occupation">Occupation</label>
                <select id="occupation" required>
                    <option value="">Select Occupation</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                </select>
            </div>
            <div class="form-group">
                <label for="requestedLimit">Requested Credit Limit</label>
                <input type="number" id="requestedLimit" required>
            </div>
            <button type="submit" class="action-btn">Submit Application</button>
        </form>
    `;
    openModal(content);
}

// Card Protection & Cancellation
function openCardProtection() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Card Protection Services</h2>
        <div class="protection-options">
            <form id="cardProtectionForm" onsubmit="handleCardProtection(event)">
                <div class="form-group">
                    <label>
                        <input type="radio" name="protectionType" value="block" required>
                        Temporarily Block Card
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="radio" name="protectionType" value="report" required>
                        Report Fraudulent Transaction
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="radio" name="protectionType" value="cancel" required>
                        Request Card Cancellation
                    </label>
                </div>
                <div class="form-group">
                    <label for="cardNumber">Last 4 digits of Card</label>
                    <input type="text" id="cardNumber" maxlength="4" pattern="[0-9]{4}" required>
                </div>
                <div class="form-group">
                    <label for="reason">Reason</label>
                    <select id="reason" required>
                        <option value="">Select Reason</option>
                        <option value="lost">Lost Card</option>
                        <option value="stolen">Stolen Card</option>
                        <option value="fraud">Suspicious Activity</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button type="submit" class="action-btn">Submit Request</button>
            </form>
        </div>
    `;
    openModal(content);
}

// Card Activation
function openCardActivation() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Card Activation</h2>
        <form id="cardActivationForm" onsubmit="handleCardActivation(event)">
            <div class="form-group">
                <label for="newCardNumber">Card Number</label>
                <input type="text" id="newCardNumber" maxlength="16" pattern="[0-9]{16}" required>
            </div>
            <div class="form-group">
                <label for="expiryDate">Expiry Date</label>
                <input type="month" id="expiryDate" required>
            </div>
            <div class="form-group">
                <label for="cvv">CVV</label>
                <input type="password" id="cvv" maxlength="3" pattern="[0-9]{3}" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="termsAccepted" required>
                    I agree to the terms and conditions
                </label>
            </div>
            <button type="submit" class="action-btn">Activate Card</button>
        </form>
    `;
    openModal(content);
}

// Online Usage Management
function openOnlineUsage() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Online Usage Management</h2>
        <form id="usageManagementForm" onsubmit="handleUsageManagement(event)">
            <div class="form-group">
                <label>
                    <input type="checkbox" id="enableOnline">
                    Enable Online Transactions
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="enableInternational">
                    Enable International Transactions
                </label>
            </div>
            <div class="form-group">
                <label for="transactionLimit">Daily Transaction Limit</label>
                <select id="transactionLimit" required>
                    <option value="50000">₹50,000</option>
                    <option value="100000">₹1,00,000</option>
                    <option value="200000">₹2,00,000</option>
                    <option value="500000">₹5,00,000</option>
                </select>
            </div>
            <div class="form-group">
                <label for="merchantCategories">Block Merchant Categories</label>
                <select id="merchantCategories" multiple>
                    <option value="gambling">Gambling</option>
                    <option value="adult">Adult Entertainment</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="gaming">Gaming</option>
                </select>
            </div>
            <button type="submit" class="action-btn">Save Settings</button>
        </form>
    `;
    openModal(content);
}

// Form Handlers
function handleLimitIncrease(event) {
    event.preventDefault();
    alert('Your limit increase request has been submitted successfully. We will review your application and get back to you within 48 hours.');
    event.target.closest('.modal-overlay').remove();
}

function handleCardProtection(event) {
    event.preventDefault();
    alert('Your card protection request has been processed. Our team will contact you shortly for verification.');
    event.target.closest('.modal-overlay').remove();
}

function handleCardActivation(event) {
    event.preventDefault();
    alert('Your card has been activated successfully. You can now use your card for transactions.');
    event.target.closest('.modal-overlay').remove();
}

function handleUsageManagement(event) {
    event.preventDefault();
    alert('Your usage preferences have been updated successfully.');
    event.target.closest('.modal-overlay').remove();
}

// Quick Actions Handlers
function viewStatement() {
    alert('Your statement will be displayed shortly.');
}

function payBill() {
    alert('Redirecting to bill payment page...');
}

function setAlerts() {
    alert('Opening alerts configuration...');
}

function viewTransactions() {
    alert('Loading transaction history...');
}

// Document Ready Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quick Action Links
    document.querySelectorAll('.quick-actions-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('href').replace('#', '');
            switch(action) {
                case 'statement':
                    viewStatement();
                    break;
                case 'pay-bill':
                    payBill();
                    break;
                case 'alerts':
                    setAlerts();
                    break;
                case 'transactions':
                    viewTransactions();
                    break;
            }
        });
    });
});

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    alert('Thank you for contacting us! We will get back to you shortly.');
    event.target.reset();
}

// EMI Calculator
function openEmiCalculator() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>EMI Calculator</h2>
        <form class="calculator-form" onsubmit="calculateEMI(event)">
            <div class="form-group">
                <label for="loanAmount">Purchase Amount (₹)</label>
                <input type="number" id="loanAmount" required min="1000">
            </div>
            <div class="form-group">
                <label for="tenure">Tenure (Months)</label>
                <select id="tenure" required>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="9">9 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                </select>
            </div>
            <div class="form-group">
                <label for="interestRate">Interest Rate (%)</label>
                <input type="number" id="interestRate" value="12" step="0.1" required>
            </div>
            <button type="submit" class="action-btn">Calculate EMI</button>
            <div id="emiResult" class="calculator-result" style="display: none;">
                <h3>Monthly EMI</h3>
                <p id="emiAmount">₹0</p>
            </div>
        </form>
    `;
    openModal(content);
}

function calculateEMI(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const tenure = parseInt(document.getElementById('tenure').value);
    const interest = parseFloat(document.getElementById('interestRate').value) / 1200; // Convert to monthly rate
    
    const emi = amount * interest * Math.pow(1 + interest, tenure) / (Math.pow(1 + interest, tenure) - 1);
    
    const resultDiv = document.getElementById('emiResult');
    const emiAmount = document.getElementById('emiAmount');
    resultDiv.style.display = 'block';
    emiAmount.textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`;
}

// Balance Transfer
function openBalanceTransfer() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Balance Transfer Request</h2>
        <form onsubmit="handleBalanceTransfer(event)">
            <div class="form-group">
                <label for="otherBank">Other Bank Name</label>
                <input type="text" id="otherBank" required>
            </div>
            <div class="form-group">
                <label for="cardNumber">Other Bank Card Number</label>
                <input type="text" id="cardNumber" maxlength="16" pattern="[0-9]{16}" required>
            </div>
            <div class="form-group">
                <label for="transferAmount">Transfer Amount (₹)</label>
                <input type="number" id="transferAmount" required min="5000">
            </div>
            <div class="form-group">
                <label for="transferTenure">Transfer Tenure</label>
                <select id="transferTenure" required>
                    <option value="3">3 Months @ 0%</option>
                    <option value="6">6 Months @ 2%</option>
                    <option value="12">12 Months @ 4%</option>
                    <option value="18">18 Months @ 6%</option>
                </select>
            </div>
            <button type="submit" class="action-btn">Submit Transfer Request</button>
        </form>
    `;
    openModal(content);
}

function handleBalanceTransfer(event) {
    event.preventDefault();
    alert('Your balance transfer request has been submitted successfully. We will process it within 7 working days.');
    event.target.closest('.modal-overlay').remove();
}

// Card Upgrade
function openCardUpgrade() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Card Upgrade Options</h2>
        <form onsubmit="handleCardUpgrade(event)">
            <div class="form-group">
                <label>Select Your New Card</label>
                <div class="card-options">
                    <label>
                        <input type="radio" name="newCard" value="platinum" required>
                        Platinum Credit Card
                        <ul>
                            <li>4x Reward Points</li>
                            <li>Airport Lounge Access</li>
                            <li>₹1000 Welcome Bonus</li>
                        </ul>
                    </label>
                    <label>
                        <input type="radio" name="newCard" value="signature" required>
                        Signature Credit Card
                        <ul>
                            <li>8x Reward Points</li>
                            <li>Priority Pass Membership</li>
                            <li>Golf Course Access</li>
                        </ul>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label for="annualIncome">Annual Income (₹)</label>
                <input type="number" id="annualIncome" required min="300000">
            </div>
            <button type="submit" class="action-btn">Request Upgrade</button>
        </form>
    `;
    openModal(content);
}

function handleCardUpgrade(event) {
    event.preventDefault();
    alert('Your card upgrade request has been submitted. We will review your eligibility and contact you within 48 hours.');
    event.target.closest('.modal-overlay').remove();
}

// Rewards Catalog
function openRewardsCatalog() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
        <h2>Rewards Catalog</h2>
        <div class="rewards-grid">
            <div class="reward-item">
                <i class="fas fa-plane"></i>
                <h3>Travel Vouchers</h3>
                <p>10,000 points = ₹2,500</p>
                <button onclick="redeemReward('travel')" class="action-btn">Redeem</button>
            </div>
            <div class="reward-item">
                <i class="fas fa-shopping-bag"></i>
                <h3>Shopping Vouchers</h3>
                <p>8,000 points = ₹2,000</p>
                <button onclick="redeemReward('shopping')" class="action-btn">Redeem</button>
            </div>
            <div class="reward-item">
                <i class="fas fa-gift"></i>
                <h3>Cashback</h3>
                <p>5,000 points = ₹1,000</p>
                <button onclick="redeemReward('cashback')" class="action-btn">Redeem</button>
            </div>
            <div class="reward-item">
                <i class="fas fa-film"></i>
                <h3>Movie Tickets</h3>
                <p>2,000 points = ₹500</p>
                <button onclick="redeemReward('movie')" class="action-btn">Redeem</button>
            </div>
        </div>
    `;
    openModal(content);
}

function redeemReward(type) {
    alert(`Your ${type} reward redemption request has been processed. The voucher will be sent to your registered email address within 24 hours.`);
    document.querySelector('.modal-overlay').remove();
}
