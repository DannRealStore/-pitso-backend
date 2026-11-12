const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

app.post('/api/approve', async (req, res) => {
  const { paymentId } = req.body;
  try {
    const response = await axios.post(
      'https://api.minepi.com/v2/payments/' + paymentId + '/approve',
      {},
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Approve Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  try {
    const response = await axios.post(
      'https://api.minepi.com/v2/payments/' + paymentId + '/complete',
      { txid: txid },
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Complete Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
