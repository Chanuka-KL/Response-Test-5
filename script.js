document.getElementById("send").addEventListener("click", async () => {
    const message = document.getElementById("message").value;

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    const responseText = data.reply || "Error: " + data.error;

    document.getElementById("response").innerText = responseText;

    // Convert AI response to speech
    speakText(responseText);
});

async function speakText(text) {
    const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        console.error("TTS error:", await response.text());
        return;
    }

    const audioBlob = await response.blob();
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();
}
