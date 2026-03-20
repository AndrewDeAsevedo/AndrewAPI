# AndrewAPI

Small Express API that returns Google Calendar free/busy data.

## What It Does

- Exposes `GET /freebusy`
- Calls Google Calendar `freeBusy.query` under the hood
- Returns busy time blocks for a calendar between `timeMin` and `timeMax`

## Stack

- Node.js (ES modules)
- Express
- Google Calendar REST API
- dotenv

## Environment Variables

Create a `.env` file in the project root:

```env
API_KEY=your_google_api_key
CAL_ID=your_calendar_id_or_email
```

Notes:
- `CAL_ID` can be a calendar email (for example `name@gmail.com`) or a calendar ID.
- If your calendar is private, API-key access will fail and OAuth is required.

## Local Development

```bash
npm install
npm start
```

Server starts on:

`http://localhost:3000`

## Live Endpoint (Vercel)

Production endpoint:

`https://andrew-api.vercel.app/freebusy`

You can call it directly with optional query params:
- `timeMin` (ISO 8601 datetime, optional)
- `timeMax` (ISO 8601 datetime, optional)

If omitted:
- `timeMin` defaults to now
- `timeMax` defaults to 30 days from now

Example calls:

```bash
curl "https://andrew-api.vercel.app/freebusy"
```

```bash
curl "https://andrew-api.vercel.app/freebusy?timeMin=2026-03-20T00:00:00Z&timeMax=2026-03-27T23:59:59Z"
```

## API

### `GET /freebusy`

Query params:
- `timeMin` (optional, ISO 8601)
- `timeMax` (optional, ISO 8601)

Defaults:
- `timeMin`: current time
- `timeMax`: 30 days from current time

### Example Requests

Default window:

```bash
curl "http://localhost:3000/freebusy"
```

Custom window:

```bash
curl "http://localhost:3000/freebusy?timeMin=2026-03-01T00:00:00Z&timeMax=2026-03-31T23:59:59Z"
```

### Example Response Shape

```json
{
  "kind": "calendar#freeBusy",
  "timeMin": "2026-03-01T00:00:00.000Z",
  "timeMax": "2026-03-31T23:59:59.000Z",
  "calendars": {
    "your_calendar_id": {
      "busy": [
        {
          "start": "2026-03-10T14:00:00Z",
          "end": "2026-03-10T15:00:00Z"
        }
      ]
    }
  }
}
```

## Common Errors

- `403 Forbidden`: usually API key restrictions, Calendar API disabled, or calendar not truly public.
- `500 Failed to fetch free/busy data`: upstream Google request failed; check server logs for details.