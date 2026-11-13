const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PI_API_KEY = process.env.PI_API_KEY;
const PI_API = "https://api.minepi.com/v2/payments";

// 1. Ito yung luma mo, pang-validation - hindi natin tinanggal
app.get("/validation-key.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "validation-key.txt"));
});

// 2. Ito yung bago - pang-APPROVE
app.post("/createPayment", async (req, res) => {
  const { paymentId } = req.body;
  console.log("APPROVE:", paymentId);
  try {
    const r = await fetch(`${PI_API}/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    const data = await r.text();
    console.log("PI APPROVE RESULT:", data);
    res.status(r.status).send(data);
  } catch(e) {
    console.log("APPROVE ERROR:", e);
    res.status(500).send("approve failed");
  }
});

// 3. Ito yung bago - pang-COMPLETE
app.post("/completePayment", async (req, res) => {
  const { paymentId, txid } = req.body;
  console.log("COMPLETE:", paymentId, txid);
  try {
    const r = await fetch(`${PI_API}/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });
    const data = await r.text();
    console.log("PI COMPLETE RESULT:", data);
    res.status(r.status).send(data);
  } catch(e) {
    console.log("COMPLETE ERROR:", e);
    res.status(500).send("complete failed");
  }
});

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Pitso running on", PORT));
