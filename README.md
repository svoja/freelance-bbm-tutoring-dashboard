# freelance-bbm-tutoring-dashboard

Contracted by a tutoring school (BBM) to build an internal scheduling and
attendance dashboard for staff -- tracking student schedules, teacher
assignments, and subjects across class sessions.

## Stack

- **Client**: React (Create React App), dashboard UI with student cards,
  subject cards, and summary stats
- **Server**: Node.js + Express REST API serving schedule data

## Structure

| Path | Role |
|---|---|
| `client/` | React dashboard front end |
| `server/src/app.js` | Express app entry point |
| `server/src/routes/scheduleRoutes.js` | Schedule API routes |
| `server/src/controllers/scheduleController.js` | Schedule/stats logic (student, teacher, subject counts) |
| `server/data/` | Term schedule data (JSON) |

## Run it locally

```
# server
cd server && npm install && npm start

# client
cd client && npm install && npm start
```
