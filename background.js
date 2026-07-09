chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generatePage") {
        fetch("https://auto-fill-json-data.onrender.com/generate-page", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request.payload)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Backend Error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => sendResponse({ success: true, data: data }))
        .catch(error => sendResponse({ success: false, error: error.message }));

        return true; // Keeps the message channel open for async response
    }
});
