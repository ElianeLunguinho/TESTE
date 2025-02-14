// Calculator functions
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculateResult() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value);
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

export { appendToDisplay, clearDisplay, calculateResult };
