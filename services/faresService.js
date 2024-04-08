const FARES = {
    DAY: {
        BASE: 8.78,
        RATE_PER_KM: 5.22,
        TIME_RATE: 1.04 // Costo adicional por cada 45 segundos durante el día
    },
    NIGHT: {
        BASE: 10.53,
        RATE_PER_KM: 6.27,
        TIME_RATE: 1.25 // Costo adicional por cada 45 segundos durante la noche
    },
};

/**
 * Calcula el costo de un viaje en taxi.
 * @param {number} distance - La distancia del viaje en kilómetros.
 * @param {number} baseFare - La tarifa base del viaje.
 * @param {number} ratePerKm - La tarifa por kilómetro del viaje.
 * @param {number} timeRate - La tarifa adicional por tiempo de traslado.
 * @param {number} duration - El tiempo total de traslado en segundos.
 * @returns {number} El costo total del viaje en taxi.
 */
const calculateTaxiFare = (distance, baseFare, ratePerKm, timeRate, duration) => {
    // Calcular el costo total del viaje basado en la distancia
    const distanceCost = baseFare + distance * ratePerKm;

    // Calcular el costo adicional por tiempo de traslado
    const timeCost = Math.ceil(duration / 45) * timeRate;

    // Agregar el costo adicional por tiempo de traslado al costo total
    const totalCost = distanceCost + timeCost;

    return totalCost;
};

const getTaxiFare = (distance, duration) => {
    // Calculate day fare
    const dayFare = calculateTaxiFare(distance, FARES.DAY.BASE, FARES.DAY.RATE_PER_KM, FARES.DAY.TIME_RATE, duration);
    // Calculate night fare
    const nightFare = calculateTaxiFare(distance, FARES.NIGHT.BASE, FARES.NIGHT.RATE_PER_KM, FARES.NIGHT.TIME_RATE, duration);
    return [
        dayFare.toFixed(2),
        nightFare.toFixed(2)
    ];
}

export {
    getTaxiFare
}