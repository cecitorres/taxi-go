export default function getTranscript() {
    return new Promise((resolve, reject) => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "es-ES";

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Error de reconocimiento:", event.error);
            reject(event.error);
        };

        // recognition.onend = () => {
        //     console.log("Reconocimiento de voz finalizado");
        // };

        recognition.start();
    })
}