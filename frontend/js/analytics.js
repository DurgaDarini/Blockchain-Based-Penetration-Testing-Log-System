async function loadAnalytics() {
  try {
    const response = await fetch("http://localhost:5000/getAllFindings");
    const findings = await response.json();

    const severityCount = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };

    findings.forEach(f => {
      if (severityCount[f.severity] !== undefined) {
        severityCount[f.severity]++;
      }
    });

    // Summary list
    const summaryList = document.getElementById("summaryList");
    summaryList.innerHTML = "";

    for (let level in severityCount) {
      const li = document.createElement("li");
      li.textContent = `${level} Severity Findings: ${severityCount[level]}`;
      summaryList.appendChild(li);
    }

    // Chart
    const ctx = document.getElementById("severityChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(severityCount),
        datasets: [{
          label: "Number of Findings",
          data: Object.values(severityCount)
        }]
      }
    });

  } catch (error) {
    alert("Failed to load analytics from blockchain");
    console.error(error);
  }
}

loadAnalytics();
