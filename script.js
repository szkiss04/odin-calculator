// getting the necessary elements

const screenElement = document.querySelector(".screen");

const clearButton = document.querySelector("button[data-clear]")
const numberButtons = document.querySelectorAll("button[data-number]");
const operatorButtons = document.querySelectorAll("button[data-operator]");

// these two are handled separately since they introduce some complications

const decimalButton = document.querySelector("button[data-decimal]");
const equalsButton = document.querySelector("button[data-equals]");

// some booleans to determine the validity of the input "0" and "."

let isNullAllowed = false;
let isDecimalPlaced = false;
let errorFlag = false; // if we run into a math error, only a reset can get us back to life!

let digits = ["0"]; // array for storing the digits

let accumulator = 0; // variable for the accumulator
let ans = undefined; // let's use the result of the previous calculation!
let currentOperator = ""; // variable to store the current operator

function updateScreen(string, screenElem) {
    screenElem.innerText = string;
}

function reset() {
    isNullAllowed = false;
    isDecimalPlaced = false;
    accumulator = 0;
    currentOperator = "";
    digits = ["0"];
    errorFlag = false;
    updateScreen(accumulator, screenElement);
}

function arrayToNumber(array, isFloat) {
    return isFloat ? parseFloat(array.join("")) : parseInt(array.join(""));
}

function operate(operandA, operandB, operator) {
    switch (operator) {
        case "+":
            return operandA + operandB;
        case "-":
            return operandA - operandB;
        case "*":
            return operandA * operandB;
        case "/":
            if (operandB != 0) {
                return operandA / operandB;
            }
            errorFlag = true;
            return NaN;
            break;
        default:
            return;
    }
}

// attaching the event listeners to the buttons

clearButton.addEventListener("click", reset);

numberButtons.forEach((element) => {

    element.addEventListener("click", () => {
        if (errorFlag) return;
        ans = undefined;
        digits.push(element.innerText);
        updateScreen(arrayToNumber(digits, isDecimalPlaced), screenElement);
    })
});

operatorButtons.forEach((element) => {

    element.addEventListener("click", () => {

        if (errorFlag) return;

        if (currentOperator == "") {

            currentOperator = element.innerText;

            if (ans != undefined) {
                accumulator = ans;
                ans = undefined;
            } else {
                accumulator = arrayToNumber(digits, isDecimalPlaced);
                digits.splice(1, digits.length - 1);
            }

            isDecimalPlaced = false;
            return;
        }

        accumulator = operate(accumulator, arrayToNumber(digits, isDecimalPlaced), currentOperator);

        if (isNaN(accumulator)) {
            updateScreen("Math error", screenElement);
            return;
        }

        currentOperator = element.innerText;
        digits.splice(1, digits.length - 1);
        isDecimalPlaced = false;
        updateScreen(Number.isInteger(accumulator) ? parseInt(accumulator) : accumulator.toFixed(8), screenElement);
    })
});

equalsButton.addEventListener("click", () => {
    if (errorFlag) return;
    if (currentOperator != "") {
        accumulator = operate(accumulator, arrayToNumber(digits, isDecimalPlaced), currentOperator);

        if (isNaN(accumulator)) {
            updateScreen("Math error", screenElement);
            return;
        }

        ans = Number.isInteger(accumulator) ? parseInt(accumulator) : accumulator.toFixed(8);
        updateScreen(ans, screenElement);
        currentOperator = "";
        accumulator = 0;
        digits.splice(1, digits.length - 1);
    }
})

decimalButton.addEventListener("click", () => {
    if (errorFlag) return;
    if (isDecimalPlaced) return;
    digits.push(".");
    isDecimalPlaced = true;
});

reset();