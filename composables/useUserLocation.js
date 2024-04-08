import {
    ref
} from "vue";
import getCurrentPosition from "../utils/location";

export default function () {
    const loading = ref(false);
    const getUserLocation = async () => {
        if (process.env.NODE_ENV === "development") {
            // Hardcode coords for fake position
            const lat = -100.1865;
            const lon = 25.6718;
            // set fake waiting time of 5 seconds before returning values with timeout
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return [lat, lon];
        }
        // GPS location
        if ("geolocation" in navigator) {
            try {
                loading.value = true;
                const position = await getCurrentPosition();
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                return [lat, lon];
            } catch (err) {
                throw Error("Error al obtener tu ubicacion");
            } finally {
                loading.value = false;
            }
        } else {
            throw Error("Ubicacion no disponible");
        }
    };
    return {
        loading,
        getUserLocation
    }
}