// TODO: Add time costs
const FARES = {
    DAY: {
        BASE: 8.78,
        RATE_PER_KM: 5.22,
    },
    NIGHT: {
        BASE: 10.53,
        RATE_PER_KM: 6.27,
    },
};

// Crear funcion que calcule el costo de un viaje en taxi
const calculateTaxiFare = (distance, baseFare, ratePerKm) => {
    // Calcula el costo total del viaje
    const totalCost = baseFare + distance * ratePerKm;
    return totalCost;
};

const getTaxiFare = (distance) => {
    // Calculate day fare
    const dayFare = calculateTaxiFare(distance, FARES.DAY.BASE, FARES.DAY.RATE_PER_KM);
    // Calculate night fare
    const nightFare = calculateTaxiFare(distance, FARES.NIGHT.BASE, FARES.NIGHT.RATE_PER_KM);
    return [
        dayFare.toFixed(2),
        nightFare.toFixed(2)
    ];
}

export {
    getTaxiFare
}