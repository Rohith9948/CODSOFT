// 1. DOM Elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// State variables to track the calculator's current status
let currentInput = '0'; // The number currently being entered
let firstOperand = null; // The first number in the calculation
let operator = null; // The selected operator (+, -, *, /)
let awaitingNextOperand = false; // Flag to check if we should clear the display

// Function to update the calculator display
function updateDisplay() {
    // If the input is too long, reduce font size to keep it visible
    if (currentInput.length > 12) {
        display.style.fontSize = '1.8em';
    } else {
        display.style.fontSize = '2.5em';
    }
    display.value = currentInput;
}

// 2. Handle Number and Decimal Input
function inputDigit(digit) {
    if (awaitingNextOperand === true) {
        currentInput = digit;
        awaitingNextOperand = false;
    } else {
        // Prevent leading zeros unless the input is just '0'
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    // Prevent adding a decimal point if one already exists
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// 3. Handle Operators
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && awaitingNextOperand) {
        // Allows user to change the operator (e.g., from + to -)
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        // Initialize the first operand
        firstOperand = inputValue;
    } else if (operator) {
        // Calculate the result if a previous operation exists
        const result = performCalculation[operator](firstOperand, inputValue);

        currentInput = String(result);
        firstOperand = result;
    }

    awaitingNextOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Math functions object
const performCalculation = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
};

// 4. Handle Special Buttons

// AC (All Clear)
function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    awaitingNextOperand = false;
    updateDisplay();
}

// DEL (Delete last digit)
function deleteLastDigit() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0'; // If only one digit is left, reset to '0'
    }
    updateDisplay();
}

// % (Percentage)
function calculatePercentage() {
    const value = parseFloat(currentInput);
    currentInput = String(value / 100);
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const target = event.target;

        if (!target.classList.contains('btn')) {
            return;
        }

        if (target.classList.contains('number')) {
            inputDigit(target.textContent);
            return;
        }

        if (target.classList.contains('decimal')) {
            inputDecimal();
            return;
        }

        if (target.classList.contains('operator')) {
            const action = target.dataset.action;
            
            if (action === 'delete') {
                deleteLastDigit();
            } else if (action === 'percent') {
                calculatePercentage();
            } else if (target.classList.contains('clear-btn')) {
                resetCalculator();
            } else {
                handleOperator(target.textContent);
            }
            return;
        }

        if (target.classList.contains('equals')) {
            handleOperator(operator); 
            awaitingNextOperand = true; 
            return;
        }
    });
});

updateDisplay();