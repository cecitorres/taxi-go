import {
    ref,
    toValue
} from "vue";
import {
    initializeLocationClient,
    searchPlaceForSuggestions,
    searchPlaceForText,
    getPlace,
    calculateRoute,
} from "../services/locationService";

export default function (client) {
    const input = ref("");
    const suggestionsResult = ref([]);
    const suggestionsText = ref([]);
    const coordinates = ref([]);

    const onSearch = async (event) => {
        try {
            const response = await searchPlaceForSuggestions(event.query, toValue(client));
            suggestionsResult.value = response.Results;
            // Procesar el resultado para obtener las sugerencias de direcciones
            suggestionsText.value = suggestionsResult.value.map(
                (result) => result.Text
            );
        } catch (error) {
            console.error("Error searching for places:", error);
        }
    };

    const onSelect = async (event) => {
        try {
            const placeId = suggestionsResult.value.find(
                (i) => i.Text === event.value
            ).PlaceId;
            const response = await getPlace(placeId, toValue(client));
            // Procesar placeInfo para obtener las coordenadas
            coordinates.value = response.Place.Geometry.Point;
        } catch (error) {
            console.error("Error getting place coordinates:", error);
        }
    };

    const resetValues = () => {
        input.value = "";
        suggestionsResult.value = [];
        suggestionsText.value = [];
        coordinates.value = [];
    };

    return {
        input,
        suggestionsResult,
        suggestionsText,
        coordinates,
        onSearch,
        onSelect,
        resetValues
    }
}