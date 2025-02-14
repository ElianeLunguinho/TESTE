// Import modules
import { appendToDisplay, clearDisplay, calculateResult } from './calculator.js';
import { conversionUnits, performConversion, updateConverterUnits } from './converter.js';

// Conversion history
let conversionHistory = [];

// Save conversion to history
function saveConversion(value, fromUnit, toUnit, result, type) {
    const conversion = {
        timestamp: new Date().toLocaleString(),
        value,
        fromUnit,
        toUnit,
        result,
        type
    };
    conversionHistory.push(conversion);
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    conversionHistory.slice(-5).reverse().forEach(conversion => {
        const li = document.createElement('li');
        li.textContent = `${conversion.timestamp}: ${conversion.value} ${conversion.fromUnit} → ${conversion.result} ${conversion.toUnit}`;
        historyList.appendChild(li);
    });
}

// Clear history
function clearHistory() {
    conversionHistory = [];
    updateHistoryDisplay();
}


let conversionUnits = {
    currency: ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'CNY'],
    length: ['m', 'km', 'cm', 'mm', 'in', 'ft'],
    mass: ['kg', 'g', 'mg', 'lb', 'oz'],
    area: ['m²', 'km²', 'ha', 'ac', 'ft²'],
    time: ['s', 'min', 'h', 'd', 'wk'],
    volume: ['L', 'mL', 'm³', 'gal', 'fl oz'],
    data: ['B', 'KB', 'MB', 'GB', 'TB'],
    discount: ['%'],
    numeric: ['Binário', 'Decimal', 'Hexadecimal'],
    speed: ['km/h', 'm/s', 'mph', 'knots'],
    temperature: ['°C', '°F', 'K'],
    imc: ['kg/m²']
};

function updateConverterUnits() {
    const type = document.getElementById('converter-type').value;
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');
    
    // Clear existing options
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Add new options
    conversionUnits[type].forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.text = unit;
        fromSelect.add(option.cloneNode(true));
        toSelect.add(option);
    });
}

// Setup converter listeners
function setupConverterListeners() {
    const inputs = ['converter-value', 'converter-from', 'converter-to', 'converter-type'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', convertValue);
    });
}

// Fetch currency rates
async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Erro ao buscar taxas:', error);
        return null;
    }
}

// Main conversion function
async function convertValue() {
    const type = document.getElementById('converter-type').value;
    
    if (type === 'imc') {
        const weight = parseFloat(document.getElementById('imc-weight').value);
        const height = parseFloat(document.getElementById('imc-height').value);
        
        if (isNaN(weight) || isNaN(height) || height <= 0) {
            document.getElementById('converter-result').innerText = 'Valores inválidos';
            return;
        }
        
        const imc = await performConversion(weight, height, '', type);
        document.getElementById('converter-result').innerText = `IMC: ${imc} kg/m²`;
        saveConversion(weight, 'kg', 'kg/m²', imc, type);
        return;
    }
    
    const value = parseFloat(document.getElementById('converter-value').value);
    const fromUnit = document.getElementById('converter-from').value;
    const toUnit = document.getElementById('converter-to').value;
    
    if (isNaN(value)) {
        document.getElementById('converter-result').innerText = 'Valor inválido';
        return;
    }
    
    const result = await performConversion(value, fromUnit, toUnit, type);
    document.getElementById('converter-result').innerText = `${value} ${fromUnit} = ${result} ${toUnit}`;
    saveConversion(value, fromUnit, toUnit, result, type);
}


// Initialize listeners on page load
document.addEventListener('DOMContentLoaded', () => {
    setupConverterListeners();
    // Show calculator by default
    setMode('calculator');
});


// Conversion functions
function convertArea(value, fromUnit, toUnit) {
    const conversions = {
        'm²': 1,
        'km²': 1000000,
        'ha': 10000,
        'ac': 4046.86,
        'ft²': 0.092903
    };
    return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
}

function convertVolume(value, fromUnit, toUnit) {
    const conversions = {
        'L': 1,
        'mL': 0.001,
        'm³': 1000,
        'gal': 3.78541,
        'fl oz': 0.0295735
    };
    return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
}

function convertData(value, fromUnit, toUnit) {
    const conversions = {
        'B': 1,
        'KB': 1024,
        'MB': 1048576,
        'GB': 1073741824,
        'TB': 1099511627776
    };
    return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
}

function convertCurrency(value, fromUnit, toUnit) {
    const rates = {
        'BRL': 1,
        'USD': 0.19,
        'EUR': 0.18,
        'GBP': 0.15
    };
    return (value * rates[toUnit] / rates[fromUnit]).toFixed(2);
}

function convertLength(value, fromUnit, toUnit) {
    const conversions = {
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048
    };
    return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
}

function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === '°C' && toUnit === '°F') {
        return (value * 9/5 + 32).toFixed(2);
    }
    if (fromUnit === '°F' && toUnit === '°C') {
        return ((value - 32) * 5/9).toFixed(2);
    }
    if (fromUnit === '°C' && toUnit === 'K') {
        return (value + 273.15).toFixed(2);
    }
    if (fromUnit === 'K' && toUnit === '°C') {
        return (value - 273.15).toFixed(2);
    }
    if (fromUnit === '°F' && toUnit === 'K') {
        return ((value - 32) * 5/9 + 273.15).toFixed(2);
    }
    if (fromUnit === 'K' && toUnit === '°F') {
        return ((value - 273.15) * 9/5 + 32).toFixed(2);
    }
    return value;
}

function convertMass(value, fromUnit, toUnit) {
    const conversions = {
        'kg': 1,
        'g': 0.001,
        'mg': 0.000001,
        'lb': 0.453592,
        'oz': 0.0283495
    };
    return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
}

function convertSpeed(value, fromUnit, toUnit) {
    const conversions = {
        'km/h': 1,
        'm/s': 3.6,
        'mph': 1.60934,
        'knots': 1.852
    };
    return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(2);
}

function convertIMC(weight, height) {
    return (weight / (height * height)).toFixed(2);
}

function performConversion(value, fromUnit, toUnit, type) {
    switch (type) {
        case 'currency':
            return convertCurrency(value, fromUnit, toUnit);
        case 'length':
            return convertLength(value, fromUnit, toUnit);
        case 'mass':
            return convertMass(value, fromUnit, toUnit);
        case 'temperature':
            return convertTemperature(value, fromUnit, toUnit);
        case 'speed':
            return convertSpeed(value, fromUnit, toUnit);
        case 'imc':
            return convertIMC(value, fromUnit);
        case 'area':
            return convertArea(value, fromUnit, toUnit);
        case 'volume':
            return convertVolume(value, fromUnit, toUnit);
        case 'data':
            return convertData(value, fromUnit, toUnit);
        case 'discount':
            return convertDiscount(value, fromUnit, toUnit);
        case 'numeric':
            return convertNumeric(value, fromUnit, toUnit);
        default:
            return value;
    }
}

function convertDiscount(value, fromUnit, toUnit) {
    return value;
}

function convertNumeric(value, fromUnit, toUnit) {
    const conversions = {
        'Binário': 2,
        'Decimal': 10,
        'Hexadecimal': 16
    };
    
    const decimalValue = parseInt(value, conversions[fromUnit]);
    
    if (toUnit === 'Binário') {
        return decimalValue.toString(2);
    } else if (toUnit === 'Hexadecimal') {
        return decimalValue.toString(16).toUpperCase();
    }
    return decimalValue.toString(10);
}
