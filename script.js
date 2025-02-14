// Funções da Calculadora
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculateResult() {
    try {
        const result = eval(document.getElementById('display').value);
        document.getElementById('display').value = result;
    } catch (error) {
        document.getElementById('display').value = 'Erro';
    }
}

// Funções do Conversor
let conversionHistory = [];

function updateConverterUnits() {
    const type = document.getElementById('converter-type').value;
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
const units = {
    currency: ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'],
    length: ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
    mass: ['kg', 'g', 'mg', 'lb', 'oz', 'ton'],
    temperature: ['°C', '°F', 'K'],
    area: ['m²', 'km²', 'ha', 'ac', 'ft²', 'yd²', 'mi²'],
    volume: ['L', 'mL', 'm³', 'gal', 'fl oz', 'pt', 'qt'],
    data: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
    speed: ['km/h', 'm/s', 'mph', 'knots', 'ft/s'],
    time: ['s', 'min', 'h', 'd', 'wk', 'mo', 'yr'],
    pressure: ['Pa', 'kPa', 'bar', 'psi', 'atm'],
    energy: ['J', 'kJ', 'cal', 'kcal', 'kWh']
}[type] || [];

    
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.text = unit;
        fromSelect.add(option.cloneNode(true));
        toSelect.add(option);
    });
}

async function convertValue() {
    const valueInput = document.getElementById('converter-value');
    const fromUnit = document.getElementById('converter-from').value;
    const toUnit = document.getElementById('converter-to').value;
    const resultDiv = document.getElementById('converter-result');
    const loadingSpinner = document.getElementById('loading-spinner');

    
    // Mostrar spinner de carregamento
    loadingSpinner.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        // Validação do valor
        const value = parseFloat(valueInput.value);
        if (isNaN(value)) {
            throw new Error('Por favor, insira um valor numérico válido.');
        }

    
        // Validação das unidades
        if (!fromUnit || !toUnit) {
            throw new Error('Selecione as unidades de conversão.');
        }
        
        const result = await performConversion(value, fromUnit, toUnit);
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>Resultado:</strong> ${value} ${fromUnit} = ${result} ${toUnit}
                <div class="mt-2 small">Taxa atualizada em: ${new Date().toLocaleString()}</div>
            </div>
        `;
        saveConversion(value, fromUnit, toUnit, result);
        valueInput.classList.remove('is-invalid');
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
    } finally {
        // Esconder spinner de carregamento
        loadingSpinner.style.display = 'none';
    }

}


function performConversion(value, fromUnit, toUnit) {
    const type = document.getElementById('converter-type').value;
    
    // Verificar se as unidades são compatíveis
    const units = {
        currency: ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'],
        length: ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
        mass: ['kg', 'g', 'mg', 'lb', 'oz', 'ton'],
        temperature: ['°C', '°F', 'K'],
        area: ['m²', 'km²', 'ha', 'ac', 'ft²', 'yd²', 'mi²'],
        volume: ['L', 'mL', 'm³', 'gal', 'fl oz', 'pt', 'qt'],
        data: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        speed: ['km/h', 'm/s', 'mph', 'knots', 'ft/s'],
        time: ['s', 'min', 'h', 'd', 'wk', 'mo', 'yr'],
        pressure: ['Pa', 'kPa', 'bar', 'psi', 'atm'],
        energy: ['J', 'kJ', 'cal', 'kcal', 'kWh']
    }[type] || [];
    
    if (!units.includes(fromUnit) || !units.includes(toUnit)) {
        throw new Error('Unidades incompatíveis para conversão');
    }

    // Implementar as conversões específicas
    switch (type) {
        case 'currency':
            return convertCurrency(value, fromUnit, toUnit);
        case 'length':
            return convertLength(value, fromUnit, toUnit);
        case 'mass':
            return convertMass(value, fromUnit, toUnit);
        case 'temperature':
            return convertTemperature(value, fromUnit, toUnit);
        case 'area':
            return convertArea(value, fromUnit, toUnit);
        case 'volume':
            return convertVolume(value, fromUnit, toUnit);
        case 'data':
            return convertData(value, fromUnit, toUnit);
        case 'speed':
            return convertSpeed(value, fromUnit, toUnit);
        case 'time':
            return convertTime(value, fromUnit, toUnit);
        case 'pressure':
            return convertPressure(value, fromUnit, toUnit);
        case 'energy':
            return convertEnergy(value, fromUnit, toUnit);
        default:
            throw new Error('Tipo de conversão não suportado');
    }
}


async function convertCurrency(value, fromUnit, toUnit) {
    try {
        // Buscar taxas de câmbio em tempo real
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromUnit}`);
        const data = await response.json();
        
        if (!data.rates || !data.rates[toUnit]) {
            throw new Error('Moeda não suportada ou erro na API');
        }
        
        const rate = data.rates[toUnit];
        return (value * rate).toFixed(2);
    } catch (error) {
        console.error('Erro ao buscar taxas:', error);
        // Fallback para taxas fixas caso a API falhe
        const rates = {
            'BRL': 1,
            'USD': 0.19,
            'EUR': 0.18,
            'GBP': 0.15,
            'JPY': 28.50,
            'CAD': 0.26,
            'AUD': 0.29,
            'CHF': 0.17
        };
        
        if (!rates[fromUnit] || !rates[toUnit]) {
            throw new Error('Moeda não suportada');
        }
        
        return (value * rates[toUnit] / rates[fromUnit]).toFixed(2);
    }
}



function convertLength(value, fromUnit, toUnit) {
    const conversions = {
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de comprimento não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(4);
}

function convertMass(value, fromUnit, toUnit) {
    const conversions = {
        'kg': 1,
        'g': 0.001,
        'mg': 0.000001,
        'lb': 0.453592,
        'oz': 0.0283495,
        'ton': 1000
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de massa não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(4);
}

function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    // Converter para Celsius primeiro
    let celsius;
    if (fromUnit === '°C') {
        celsius = value;
    } else if (fromUnit === '°F') {
        celsius = (value - 32) * (5/9);
    } else if (fromUnit === 'K') {
        celsius = value - 273.15;
    } else {
        throw new Error('Unidade de temperatura não suportada');
    }
    
    // Converter para unidade desejada
    if (toUnit === '°C') {
        return celsius.toFixed(2);
    } else if (toUnit === '°F') {
        return (celsius * (9/5) + 32).toFixed(2);
    } else if (toUnit === 'K') {
        return (celsius + 273.15).toFixed(2);
    }
    
    throw new Error('Unidade de temperatura não suportada');
}

function convertArea(value, fromUnit, toUnit) {
    const conversions = {
        'm²': 1,
        'km²': 1000000,
        'ha': 10000,
        'ac': 4046.86,
        'ft²': 0.092903,
        'yd²': 0.836127,
        'mi²': 2589988.11
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de área não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(4);
}

function convertVolume(value, fromUnit, toUnit) {
    const conversions = {
        'L': 1,
        'mL': 0.001,
        'm³': 1000,
        'gal': 3.78541,
        'fl oz': 0.0295735,
        'pt': 0.473176,
        'qt': 0.946353
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de volume não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(4);
}

function convertData(value, fromUnit, toUnit) {
    const conversions = {
        'B': 1,
        'KB': 1024,
        'MB': 1048576,
        'GB': 1073741824,
        'TB': 1099511627776,
        'PB': 1125899906842624
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de dados não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(4);
}

function convertSpeed(value, fromUnit, toUnit) {
    const conversions = {
        'km/h': 1,
        'm/s': 3.6,
        'mph': 1.60934,
        'knots': 1.852,
        'ft/s': 1.09728
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de velocidade não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(2);
}

function convertTime(value, fromUnit, toUnit) {
    const conversions = {
        's': 1,
        'min': 60,
        'h': 3600,
        'd': 86400,
        'wk': 604800,
        'mo': 2629800, // Mês médio
        'yr': 31557600 // Ano médio
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de tempo não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(2);
}

function convertPressure(value, fromUnit, toUnit) {
    const conversions = {
        'Pa': 1,
        'kPa': 1000,
        'bar': 100000,
        'psi': 6894.76,
        'atm': 101325
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de pressão não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(2);
}

function convertEnergy(value, fromUnit, toUnit) {
    const conversions = {
        'J': 1,
        'kJ': 1000,
        'cal': 4.184,
        'kcal': 4184,
        'kWh': 3600000
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error('Unidade de energia não suportada');
    }
    
    const result = value * conversions[fromUnit] / conversions[toUnit];
    return result.toFixed(2);
}



function saveConversion(value, fromUnit, toUnit, result) {
    const conversion = {
        timestamp: new Date().toLocaleString(),
        value,
        fromUnit,
        toUnit,
        result
    };
    conversionHistory.push(conversion);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    conversionHistory.slice(-5).reverse().forEach(conversion => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${conversion.timestamp}: ${conversion.value} ${conversion.fromUnit} → ${conversion.result} ${conversion.toUnit}`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    conversionHistory = [];
    updateHistoryDisplay();
}

// Função para alternar entre Calculadora e Conversor
function setMode(mode) {
    const calculator = document.getElementById('calculator');
    const converter = document.getElementById('converter');
    const buttons = document.querySelectorAll('.mode-selector .btn');
    
    if (mode === 'calculator') {
        calculator.style.display = 'block';
        converter.style.display = 'none';
    } else {
        calculator.style.display = 'none';
        converter.style.display = 'block';
        updateConverterUnits();
    }
    
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase() === mode) {
            button.classList.add('active');
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar calculadora por padrão
    setMode('calculator');
    
    // Configurar listeners do conversor
    document.getElementById('converter-type').addEventListener('change', updateConverterUnits);
    document.getElementById('converter-value').addEventListener('input', convertValue);
    document.getElementById('converter-from').addEventListener('change', convertValue);
    document.getElementById('converter-to').addEventListener('change', convertValue);
    
    // Configurar botão de limpar histórico
    document.querySelector('.clear-history').addEventListener('click', clearHistory);
});
