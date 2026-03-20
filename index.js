import 'dotenv/config';
import express from 'express';

const app = express();
const port = 3000;
const calId = process.env.CAL_ID;
const apiKey = process.env.API_KEY;


// Endpoint to return data
app.get('/freebusy', async (req, res) => {
  try {
    // If no timeMin use current time
    const timeMin = req.query.timeMin ?? new Date().toISOString();
    // If no timeMax use one month from current time
    const timeMax = req.query.timeMax ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const data = await fetchFreebusy(timeMin, timeMax);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch free/busy data' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Function to actually fetch data
async function fetchFreebusy(timeMin, timeMax) {
  const url = `https://www.googleapis.com/calendar/v3/freeBusy?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calId }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
