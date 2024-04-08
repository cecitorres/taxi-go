import {
    ref
} from "vue";
import {
    calculateRoute
} from "@/services/locationService"
import {
    getTaxiFare
} from "@/services/faresService";
export default function (client) {
    const loading = ref(false);
    const distance = ref(0);
    const duration = ref(0);
    const fareCost = ref({
        day: 0,
        night: 0
    });
    const routeString = ref();
    const calculateTaxiFare = async (originCoordinates, destinationCoordinates) => {
        loading.value = true;
        try {
            const response = await calculateRoute(
                originCoordinates,
                destinationCoordinates,
                toValue(client)
            );
            distance.value = response.Summary.Distance.toFixed(2);
            duration.value = response.Summary.DurationSeconds.toFixed(2);
            // steps are also available in response

            const [day, night] = getTaxiFare(
                distance.value,
                duration.value
            );
            fareCost.value = {
                day,
                night
            }
            routeString.value = response.Legs[0].Geometry.LineString;
        } catch (error) {
            throw Error("Error calculando su ruta");
        } finally {
            loading.value = false;
        }
    };
    return {
        loading,
        distance,
        duration,
        fareCost,
        routeString,
        calculateTaxiFare
    }
}