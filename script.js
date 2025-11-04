// Foydalanuvchilar ro'yxati (haqiqiy ilovada bu ma'lumotlar bazasida saqlanadi)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Test savollari (O'zbek tilida)
const questions = [
    {
        id: 1,
        subject: "Algebra",
        question: "x ning qiymatini toping: 2x + 5 = 15",
        options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
        correctAnswer: 0
    },
    {
        id: 2,
        subject: "Trigonometriya",
        question: "sin(30°) ni toping",
        options: ["0.5", "0.707", "0.866", "1"],
        correctAnswer: 0
    },
    {
        id: 3,
        subject: "Stereometriya",
        question: "To'rtburchakli parallelepiped hajmini toping, agar uning o'lchamlari 4 sm, 3 sm va 2 sm bo'lsa",
        options: ["24 sm³", "12 sm³", "18 sm³", "20 sm³"],
        correctAnswer: 0
    },
    {
        id: 4,
        subject: "Algebra",
        question: "x² - 9 ni faktorizatsiya qiling",
        options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "(x+3)²"],
        correctAnswer: 0
    },
    {
        id: 5,
        subject: "Trigonometriya",
        question: "Agar cos(θ) = 0.5 bo'lsa, θ nechaga teng?",
        options: ["30°", "45°", "60°", "90°"],
        correctAnswer: 2
    },
    {
        id: 6,
        subject: "Stereometriya",
        question: "Radiusi 3 sm bo'lgan sharning sirti qancha?",
        options: ["12π sm²", "18π sm²", "24π sm²", "36π sm²"],
        correctAnswer: 3
    },
    {
        id: 7,
        subject: "Algebra",
        question: "x² - 4/(x - 2) ni soddalashtiring",
        options: ["x + 2", "x - 2", "x² + 2", "x² - 2"],
        correctAnswer: 0
    },
    {
        id: 8,
        subject: "Trigonometriya",
        question: "tan(45°) ni toping",
        options: ["0.5", "1", "√2", "√3"],
        correctAnswer: 1
    },
    {
        id: 9,
        subject: "Stereometriya",
        question: "To'rtburchakli prizmaning qirralari nechta?",
        options: ["6", "8", "10", "12"],
        correctAnswer: 3
    },
    {
        id: 10,
        subject: "Algebra",
        question: "x ning qiymatini toping: 3(x + 2) = 15",
        options: ["x = 3", "x = 5", "x = 7", "x = 9"],
        correctAnswer: 0
    }
];

let currentQuestionIndex = 0;
let selectedAnswers = Array(questions.length).fill(null);
let startTime = null;
let timer = null;
let timeLeft = 25 * 60; // 25 daqiqa sekundlarda
let currentUser = null;

// DOM Elementlar
const authScreen = document.getElementById('auth-screen');
const registerScreen = document.getElementById('register-screen');
const startScreen = document.getElementById('start-screen');
const testScreen = document.getElementById('test-screen');
const resultsScreen = document.getElementById('results-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const questionContainer = document.getElementById('question-container');
const currentQuestionEl = document.getElementById('current-question');
const timeLeftEl = document.getElementById('time-left');
const scoreEl = document.getElementById('score');
const percentageEl = document.getElementById('percentage');
const timeTakenEl = document.getElementById('time-taken');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// Ilova ishga tushganda
document.addEventListener('DOMContentLoaded', function() {
    showTime();
    setInterval(showTime, 1000);
    
    // Kirish formasi
    loginForm.addEventListener('submit', handleLogin);
    
    // Ro'yxatdan o'tish formasi
    registerForm.addEventListener('submit', handleRegister);
    
    // Kirish/ro'yxatdan o'tish tugmalari
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        authScreen.classList.remove('active');
        registerScreen.classList.add('active');
    });
    
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerScreen.classList.remove('active');
        authScreen.classList.add('active');
    });
    
    startBtn.addEventListener('click', startTest);
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitBtn.addEventListener('click', submitTest);
    restartBtn.addEventListener('click', restartTest);
});

// Vaqt ko'rsatish
function showTime() {
    document.getElementById('currentTime').innerHTML = new Date().toLocaleString('uz-UZ');
}

// Kirish funksiyasi
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Foydalanuvchini tekshirish
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        authScreen.classList.remove('active');
        startScreen.classList.add('active');
    } else {
        alert('Foydalanuvchi nomi yoki parol noto\'g\'ri!');
    }
}

// Ro'yxatdan o'tish funksiyasi
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Parollar mos kelishini tekshirish
    if (password !== confirmPassword) {
        alert('Parollar mos emas!');
        return;
    }
    
    // Foydalanuvchi allaqachon mavjudligini tekshirish
    if (users.some(u => u.username === username)) {
        alert('Bu foydalanuvchi nomi band!');
        return;
    }
    
    // Yangi foydalanuvchini qo'shish
    const newUser = {
        username: username,
        email: email,
        password: password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Ro'yxatdan o'tish muvaffaqiyatli bo'lsa, kirish ekraniga o'tish
    alert('Ro\'yxatdan o\'tish muvaffaqiyatli amalga oshirildi!');
    registerScreen.classList.remove('active');
    authScreen.classList.add('active');
}

// Testni boshlash
function startTest() {
    startScreen.classList.remove('active');
    testScreen.classList.add('active');
    currentQuestionIndex = 0;
    selectedAnswers = Array(questions.length).fill(null);
    startTime = new Date();
    timeLeft = 25 * 60;
    updateTimer();
    timer = setInterval(updateTimer, 1000);
    loadQuestion(currentQuestionIndex);
    updateNavigationButtons();
}

// Vaqtni yangilash
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        submitTest();
        return;
    }
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeLeftEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeLeft--;
}

// Savolni yuklash
function loadQuestion(index) {
    const question = questions[index];
    let optionsHTML = '';
    
    question.options.forEach((option, i) => {
        const isSelected = selectedAnswers[index] === i;
        optionsHTML += `
            <div class="option ${isSelected ? 'selected' : ''}" data-index="${i}">
                ${option}
            </div>
        `;
    });
    
    questionContainer.innerHTML = `
        <div class="question">
            <h3>${index + 1}-savol (${question.subject})</h3>
            <p>${question.question}</p>
            <div class="options">
                ${optionsHTML}
            </div>
        </div>
    `;
    
    // Variantlarga bosish eventlarini qo'shish
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedIndex = parseInt(this.getAttribute('data-index'));
            selectOption(index, selectedIndex);
        });
    });
    
    currentQuestionEl.textContent = index + 1;
}

// Variant tanlash
function selectOption(questionIndex, optionIndex) {
    selectedAnswers[questionIndex] = optionIndex;
    
    // UI ni yangilash
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`.option[data-index="${optionIndex}"]`).classList.add('selected');
}

// Navigatsiya funksiyalari
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
        updateNavigationButtons();
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === questions.length - 1;
    submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
}

// Testni yakunlash
function submitTest() {
    clearInterval(timer);
    
    // Ballarni hisoblash
    let score = 0;
    questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
            score++;
        }
    });
    
    // Sarflangan vaqtni hisoblash
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    
    // Natijalarni ko'rsatish
    scoreEl.textContent = score;
    percentageEl.textContent = Math.round((score / questions.length) * 100);
    timeTakenEl.textContent = timeTaken;
    
    // Test ekranini yashirish va natijalar ekranini ko'rsatish
    testScreen.classList.remove('active');
    resultsScreen.classList.add('active');
}

// Testni qayta boshlash
function restartTest() {
    resultsScreen.classList.remove('active');
    startScreen.classList.add('active');
    currentQuestionIndex = 0;
    selectedAnswers = Array(questions.length).fill(null);
    timeLeft = 25 * 60;
}
