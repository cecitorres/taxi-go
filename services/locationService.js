import {
    withAPIKey
} from "@aws/amazon-location-utilities-auth-helper";
import {
    LocationClient,
    SearchPlaceIndexForTextCommand,
    SearchPlaceIndexForSuggestionsCommand,
    GetPlaceCommand,
    CalculateRouteCommand,
} from "@aws-sdk/client-location";

// Amazon Location Service resource names:
const placesName = "TaxiGo";
const region = "us-east-1";

export async function initializeLocationClient() {
    try {
        const runtimeConfig = useRuntimeConfig();
        const apiKey = runtimeConfig.public.AWS_LOCATION_SERVICE_KEY;
        const authHelper = await withAPIKey(apiKey);

        const client = new LocationClient({
            region,
            ...authHelper.getLocationClientConfig(), // sets up the Location client to use the API Key defined above
        });

        return client;
    } catch (error) {
        throw Error("Error en el servidor");
    }
}
const NUEVO_LEON_COORDS = [-100.6689, 24.4389, -99.7383, 25.6955];
const MONTERREY_MX_COORDS = [-100.3175, 25.6856]

const searchPlaceForSuggestions = async (text, client) => {
    const input = {
        IndexName: placesName, // required
        Text: text, // required,
        FilterCountries: ["MEX"],
        BiasPosition: MONTERREY_MX_COORDS,
        // FilterBBox: NUEVO_LEON_COORDS
    };
    const command = new SearchPlaceIndexForSuggestionsCommand(input);

    //call a search function with the location client:
    const result = await client.send(command);

    return result
}

const searchPlaceForText = async (text, client) => {
    try {
        const input = {
            IndexName: placesName, // required
            Text: text, // required
        };
        const command = new SearchPlaceIndexForTextCommand(input);

        const result = await client.send(command);
        const firstResult = result.Results[0].Place;
        return firstResult;
    } catch (error) {
        console.error("Error searching for place:", error);
        throw error;
    }
};

const getPlace = async (placeId, client) => {
    try {
        const input = {
            IndexName: placesName, // required
            PlaceId: placeId, // required
        };
        const command = new GetPlaceCommand(input);

        const result = await client.send(command);

        return result;
    } catch (error) {
        console.error("Error getting place:", error);
        throw error;
    }
}

const calculateRoute = async (origin, destination, client) => {
    try {
        const input = {
            CalculatorName: placesName, // required
            DeparturePosition: origin,
            DestinationPosition: destination,
            IncludeLegGeometry: true,
        };
        const command = new CalculateRouteCommand(input);

        const result = await client.send(command);

        return result;
    } catch (error) {
        console.error("Error calculating route:", error);
        throw error;
    }
}

export {
    searchPlaceForSuggestions,
    searchPlaceForText,
    getPlace,
    calculateRoute
}