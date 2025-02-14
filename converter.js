// Conversion units and rates
const conversionUnits = {
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

// Currency rates cache
let currencyRatesCache = null;
const CURRENCY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

// Fetch currency rates with cache
async function fetchCurrencyRates() {
    if (currencyRatesCache && (Date.now() - currencyRatesCache.timestamp) < CURRENCY_CACHE_DURATION) {
        return currencyRatesCache.rates;
    }

    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
        const data = await response.json();
        currencyRatesCache = {
            rates: data.rates,
            timestamp: Date.now()
        };
        return data.rates;
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        return null;
    }
}

// Conversion functions
const conversionFunctions = {
    area: (value, fromUnit, toUnit) => {
        const conversions = {
            'm²': 1,
            'km²': 1000000,
            'ha': 10000,
            'ac': 4046.86,
            'ft²': 0.092903
        };
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    },

    volume: (value, fromUnit, toUnit) => {
        const conversions = {
            'L': 1,
            'mL': 0.001,
            'm³': 1000,
            'gal': 3.78541,
            'fl oz': 0.0295735
        };
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    },

    data: (value, fromUnit, toUnit) => {
        const conversions = {
            'B': 1,
            'KB': 1024,
            'MB': 1048576,
            'GB': 1073741824,
            'TB': 1099511627776
        };
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    },

    currency: async (value, fromUnit, toUnit) => {
        const rates = await fetchCurrencyRates();
        if (!rates) return 'Error fetching rates';
        return (value * rates[toUnit] / rates[fromUnit]).toFixed(2);
    },

    length: (value, fromUnit, toUnit) => {
        const conversions = {
            'm': 1,
            'km': 1000,
            'cm': 0.01,
            'mm': 0.001,
            'in': 0.0254,
            'ft': 0.3048
        };
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    },

    temperature: (value, fromUnit, toUnit) => {
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
    },

    mass: (value, fromUnit, toUnit) => {
        const conversions = {
            'kg': 1,
            'g': 0.001,
            'mg': 0.000001,
            'lb': 0.453592,
            'oz': 0.0283495
        };
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    },

    speed: (value, fromUnit, toUnit) => {
        const conversions = {
            'km/h': 1,
            'm/s': 3.6,
            'mph': 1.60934,
            'knots': 1.852
        };
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(2);
    },

    imc: (weight, height) => {
        return (weight / (height * height)).toFixed(2);
    },

    discount: (value, fromUnit, toUnit) => {
        return value;
    },

    numeric: (value, fromUnit, toUnit) => {
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
};

// Main conversion function
async function performConversion(value, fromUnit, toUnit, type) {
    if (!conversionFunctions[type]) return value;
    return await conversionFunctions[type](value, fromUnit, toUnit);
}

export { conversionUnits, performConversion, updateConverterUnits };
