document.getElementById("send").addEventListener("click", async () => {
    const message = document.getElementById("message").value;

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    document.getElementById("response").innerText = data.reply || "Error: " + data.error;
});