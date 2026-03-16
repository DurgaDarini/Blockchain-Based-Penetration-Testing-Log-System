async function loadFindings() {
  const spinner = document.getElementById("loadingSpinner");
  const table = document.getElementById("findingsTable");

  spinner.style.display = "block";

  try {
    const response = await fetch("http://localhost:5000/getAllFindings");
    const findings = await response.json();

    spinner.style.display = "none";
    table.innerHTML = "";

    findings.forEach(finding => {

      const badgeClass =
        finding.severity === "Low" ? "badge badge-low" :
        finding.severity === "Medium" ? "badge badge-medium" :
        finding.severity === "High" ? "badge badge-high" :
        "badge badge-critical";

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${finding.id}</td>
        <td>${finding.target}</td>
        <td><span class="${badgeClass}">${finding.severity}</span></td>
        <td>${finding.description}</td>
        <td>${finding.evidence}</td>
        <td>${finding.tester}</td>
        <td>${finding.timestamp}</td>
      `;

      table.appendChild(row);
    });

  } catch (error) {
    spinner.style.display = "none";
    alert("Failed to load data");
  }
}

loadFindings();