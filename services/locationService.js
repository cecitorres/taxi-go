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
export async function initializeLocationClient() {
    const runtimeConfig = useRuntimeConfig();
    try {
        const authHelper = await withAPIKey(
            runtimeConfig.public.AWS_LOCATION_SERVICE_KEY
        );

        const client = new LocationClient({
            region: "us-east-1",
            ...authHelper.getLocationClientConfig(), // sets up the Location client to use the API Key defined above
        });
        return client;
    } catch (error) {
        console.error("Error initializing Location client:", error);
        throw error;
    }
}
const NUEVO_LEON_COORDS = [-100.6689, 24.4389, -99.7383, 25.6955]

const searchPlaceForSuggestions = async (text, client) => {
    const input = {
        IndexName: "TaxiGo", // required
        Text: text, // required,
        // FilterCountries: ["MEX"],
        FilterBBox: NUEVO_LEON_COORDS
    };
    const command = new SearchPlaceIndexForSuggestionsCommand(input);

    //call a search function with the location client:
    const result = await client.send(command);

    return result
}

const searchPlaceForText = async (text, client) => {
    try {
        const input = {
            IndexName: "TaxiGo", // required
            Text: text, // required
        };
        const command = new SearchPlaceIndexForTextCommand(input);

        const result = await client.send(command);

        return result;
    } catch (error) {
        console.error("Error searching for place:", error);
        throw error;
    }
};

const getPlace = async (placeId, client) => {
    try {
        const input = {
            IndexName: "TaxiGo", // required
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
            CalculatorName: "TaxiGo", // required
            DestinationPosition: destination,
            DeparturePosition: origin
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