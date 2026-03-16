const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const contract = require("./blockchain/contract");
const tagsStore = require("./tagsStore");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

/* ======================================================
   DEMO USERS (ROLE-BASED LOGIN)
====================================================== */
const users = [
  { username: "tester", password: "tester123", role: "tester" },
  { username: "auditor", password: "audit123", role: "auditor" },
  { username: "admin", password: "admin123", role: "admin" }
];

/* ======================================================
   TEST ROUTE
====================================================== */
app.get("/", (req, res) => {
  res.send("Backend connected to Blockchain");
});

/* ======================================================
   LOGIN ROUTE
====================================================== */
app.post("/login", (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    role: user.role
  });
});

/* ======================================================
   ADD FINDING
====================================================== */
app.post("/addFinding", async (req, res) => {
  try {
    const {
      target,
      severity,
      vulnerabilities,
      description,
      evidence,
      tester
    } = req.body;

    // Store immutable data on blockchain
    const tx = await contract.addFinding(
      target,
      severity,
      description,
      evidence,
      tester
    );

    await tx.wait();

    // Store metadata off-chain for search
    tagsStore.add({
      target,
      severity,
      tester,
      vulnerabilities
    });

    res.json({
      message: "Finding stored on blockchain successfully",
      txHash: tx.hash
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   GET ALL FINDINGS
====================================================== */
app.get("/getAllFindings", async (req, res) => {
  try {
    const total = await contract.findingCount();
    const findings = [];

    for (let i = 1; i <= total; i++) {
      const f = await contract.getFinding(i);

      findings.push({
        id: f.id.toNumber(),
        target: f.targetSystem,
        severity: f.severity,
        description: f.description,
        evidence: f.evidenceHash,
        tester: f.tester,
        timestamp: new Date(f.timestamp.toNumber() * 1000).toLocaleString()
      });
    }

    res.json(findings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   SEARCH FINDINGS
====================================================== */
app.get("/searchFindings", async (req, res) => {
  try {
    const { target, severity, tester } = req.query;

    const total = await contract.findingCount();
    const results = [];

    for (let i = 1; i <= total; i++) {
      const f = await contract.getFinding(i);

      if (
        (!target || f.targetSystem.toLowerCase().includes(target.toLowerCase())) &&
        (!severity || f.severity === severity) &&
        (!tester || f.tester.toLowerCase().includes(tester.toLowerCase()))
      ) {
        results.push({
          id: f.id.toNumber(),
          target: f.targetSystem,
          severity: f.severity,
          description: f.description,
          evidence: f.evidenceHash,
          tester: f.tester,
          timestamp: new Date(f.timestamp.toNumber() * 1000).toLocaleString()
        });
      }
    }

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   START SERVER
====================================================== */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});