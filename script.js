let display = document.getElementById("display");
let history = document.getElementById("history");
let memory = 0;
let soundEnabled = true;
let lastResult = null;

// Initialize display
display.value = "0";

// Play sound function
function playSound() {
    if (!soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.03;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
        oscillator.stop(audioCtx.currentTime + 0.1);
        setTimeout(() => audioCtx.close(), 150);
    } catch(e) {}
}

// Add value to display
function appendValue(value) {
    playSound();
    
    if (value === 'pi') {
        if (display.value === "0") display.value = Math.PI.toString();
        else display.value += Math.PI;
        return;
    }
    if (value === 'e') {
        if (display.value === "0") display.value = Math.E.toString();
        else display.value += Math.E;
        return;
    }
    
    if (display.value === "0" && value !== ".") {
        display.value = value;
    } else if (display.value === "Error") {
        display.value = value;
    } else {
        if (value === ".") {
            let lastNumber = getLastNumber();
            if (lastNumber.includes(".")) return;
        }
        if (isOperator(value) && isOperator(getLastChar())) return;
        display.value += value;
    }
}

function getLastChar() {
    return display.value.slice(-1);
}

function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

function getLastNumber() {
    let expression = display.value;
    let operators = ['+', '-', '*', '/', '%'];
    let lastOperatorIndex = -1;
    for (let i = expression.length - 1; i >= 0; i--) {
        if (operators.includes(expression[i])) {
            lastOperatorIndex = i;
            break;
        }
    }
    if (lastOperatorIndex === -1) return expression;
    return expression.slice(lastOperatorIndex + 1);
}

function clearDisplay() {
    playSound();
    display.value = "0";
}

function clearEntry() {
    playSound();
    display.value = "0";
}

function deleteLast() {
    playSound();
    if (display.value.length === 1 || display.value === "Error") {
        display.value = "0";
    } else {
        display.value = display.value.slice(0, -1);
    }
}

// Memory Functions
function memoryAdd() {
    playSound();
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        memory += currentValue;
        updateMemoryIndicator();
        history.textContent = `M+ ${currentValue} (Memory: ${memory.toFixed(4)})`;
    }
}

function memorySubtract() {
    playSound();
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        memory -= currentValue;
        updateMemoryIndicator();
        history.textContent = `M- ${currentValue} (Memory: ${memory.toFixed(4)})`;
    }
}

function memoryRecall() {
    playSound();
    if (memory !== 0) {
        display.value = memory.toString();
        history.textContent = `Recalled memory: ${memory.toFixed(4)}`;
    }
}

function memoryClear() {
    playSound();
    memory = 0;
    updateMemoryIndicator();
    history.textContent = "Memory cleared";
}

function updateMemoryIndicator() {
    const indicator = document.getElementById("memoryIndicator");
    const memoryStatus = document.getElementById("memoryStatus");
    if (memory !== 0) {
        indicator.classList.add("active");
        memoryStatus.textContent = `Memory: ${memory.toFixed(4)}`;
    } else {
        indicator.classList.remove("active");
        memoryStatus.textContent = "Memory Empty";
    }
}

// Scientific Functions
function calculatePower() {
    playSound();
    try {
        let base = parseFloat(display.value);
        if (isNaN(base)) {
            display.value = "Error";
            return;
        }
        display.value = base + "^";
        history.textContent = `Enter exponent for ${base}^`;
    } catch (error) {
        display.value = "Error";
    }
}

function calculateFactorial() {
    playSound();
    try {
        let num = parseFloat(display.value);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
            display.value = "Error";
            history.textContent = "Factorial requires positive integer";
            return;
        }
        if (num > 170) {
            display.value = "Infinity";
            history.textContent = "Number too large";
            return;
        }
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        history.textContent = `${num}! = ${result}`;
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = "Error";
    }
}

function calculateSquareRoot() {
    playSound();
    try {
        let currentValue = parseFloat(display.value);
        if (isNaN(currentValue)) {
            display.value = "Error";
            return;
        }
        if (currentValue < 0) {
            display.value = "Error";
            history.textContent = `√(${currentValue}) = Error (Negative)`;
            return;
        }
        let result = Math.sqrt(currentValue);
        history.textContent = `√(${currentValue}) = ${result}`;
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = "Error";
    }
}

function calculatePercentage() {
    playSound();
    try {
        let currentValue = parseFloat(display.value);
        if (isNaN(currentValue)) {
            display.value = "Error";
            return;
        }
        let result = currentValue / 100;
        history.textContent = `${currentValue}% = ${result}`;
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = "Error";
    }
}

function toggleSign() {
    playSound();
    try {
        let currentValue = parseFloat(display.value);
        if (isNaN(currentValue)) {
            display.value = "Error";
            return;
        }
        let result = -currentValue;
        history.textContent = `±(${currentValue}) = ${result}`;
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = "Error";
    }
}

function calculateModulo() {
    playSound();
    appendValue('%');
}

function appendConstant(constant) {
    playSound();
    if (constant === 'pi') {
        if (display.value === "0") display.value = Math.PI.toString();
        else display.value += Math.PI;
    } else if (constant === 'e') {
        if (display.value === "0") display.value = Math.E.toString();
        else display.value += Math.E;
    }
}

// Calculate result
function calculate() {
    playSound();
    try {
        let expression = display.value;
        if (expression === "Error" || expression === "") return;
        
        if (expression.includes('^')) {
            let parts = expression.split('^');
            if (parts.length === 2) {
                let base = parseFloat(parts[0]);
                let exponent = parseFloat(parts[1]);
                let result = Math.pow(base, exponent);
                history.textContent = `${expression} = ${result}`;
                display.value = result;
                lastResult = result;
                return;
            }
        }
        
        let evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
        
        if (evalExpression.includes("/0") && !evalExpression.includes("/0.")) {
            display.value = "Error";
            history.textContent = "Error: Division by zero";
            return;
        }
        
        let result = eval(evalExpression);
        if (!isFinite(result)) {
            display.value = "Error";
            history.textContent = "Math Error";
            return;
        }
        
        result = parseFloat(result.toFixed(10));
        history.textContent = `${expression} = ${result}`;
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = "Error";
        history.textContent = "Syntax Error";
    }
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById("soundBtn");
    const soundStatus = document.getElementById("soundStatus");
    if (soundEnabled) {
        soundBtn.textContent = "🔊";
        soundStatus.textContent = "Sound ON";
        playSound();
    } else {
        soundBtn.textContent = "🔇";
        soundStatus.textContent = "Sound OFF";
    }
}

// Copy to clipboard
document.getElementById("copyBtn").addEventListener("click", function() {
    playSound();
    navigator.clipboard.writeText(display.value).then(() => {
        const originalHistory = history.textContent;
        history.textContent = "✅ Copied to clipboard!";
        setTimeout(() => {
            history.textContent = originalHistory;
        }, 1500);
    });
});

// Theme toggle
let isDarkTheme = true;
document.getElementById("themeToggle").addEventListener("click", function() {
    isDarkTheme = !isDarkTheme;
    if (isDarkTheme) {
        document.body.removeAttribute("data-theme");
        document.getElementById("themeToggle").textContent = "🌙";
    } else {
        document.body.setAttribute("data-theme", "light");
        document.getElementById("themeToggle").textContent = "☀️";
    }
    playSound();
});

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', 'Enter', 'Escape', 'Backspace', 'Delete', '%', '(', ')'];
    
    if (!validKeys.includes(key) && key !== '^') return;
    
    event.preventDefault();
    
    switch(key) {
        case 'Enter': calculate(); break;
        case 'Escape': clearDisplay(); break;
        case 'Backspace': case 'Delete': deleteLast(); break;
        case '*': appendValue('*'); break;
        case '/': appendValue('/'); break;
        case '+': appendValue('+'); break;
        case '-': appendValue('-'); break;
        case '%': calculateModulo(); break;
        case '^': calculatePower(); break;
        default: appendValue(key);
    }
});

console.log("Premium Scientific Calculator Loaded!");