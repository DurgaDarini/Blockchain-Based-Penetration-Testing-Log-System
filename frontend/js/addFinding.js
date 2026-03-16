document.getElementById("findingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get selected vulnerabilities (multi-select)
    const vulnerabilitySelect = document.getElementById("vulnerability");
    const vulnerabilities = Array.from(vulnerabilitySelect.selectedOptions)
        .map(option => option.value);

    // Prepare request data
    const data = {
        target: document.getElementById("target").value,
        severity: document.getElementById("severity").value,
        vulnerabilities: vulnerabilities,
        description: document.getElementById("description").value,
        evidence: document.getElementById("evidence").value,
        tester: document.getElementById("tester").value
    };

    try {
        const response = await fetch("http://localhost:5000/addFinding", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(
                "Finding successfully stored on blockchain!\n\n" +
                "Transaction Hash:\n" + result.txHash
            );
            document.getElementById("findingForm").reset();
        } else {
            alert("Error storing finding:\n" + result.error);
        }
    } catch (error) {
        alert("Unable to connect to backend");
        console.error(error);
    }
});
