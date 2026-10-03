# API Health Monitor

A full-stack web application for monitoring API availability, response time, uptime, and health-check history in real time.

The application periodically checks registered APIs, stores monitoring data in MongoDB, and provides a responsive React dashboard for tracking API health.

## Features

- Monitor multiple APIs
- Real-time API health checks
- Automatic scheduled monitoring
- API status detection: UP / DOWN
- Response-time tracking
- Uptime calculation
- Health-check history
- Response-time charts
- Manual "Check Now" functionality
- Add new APIs from the dashboard
- Delete monitored APIs
- Detailed API information page
- Responsive dashboard
- MongoDB data persistence

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios
- Node-Cron
- CORS
- dotenv

## Architecture

```text
React Frontend
      │
      │ Axios / REST API
      ▼
Express.js Backend
      │
      ├── API Routes
      │
      ├── Monitoring Service
      │
      └── Scheduled Health Checks
                │
                ▼
          MongoDB Atlas