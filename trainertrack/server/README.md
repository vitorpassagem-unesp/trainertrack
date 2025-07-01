## TrainerTrack Server Documentation

# TrainerTrack Server

The TrainerTrack server is a Node.js application that serves as the backend for the TrainerTrack platform. It provides RESTful APIs for managing personal trainer clients, workouts, and metrics.

## Features

- **Authentication**: Secure user authentication and authorization.
- **Client Management**: Create, read, update, and delete client information.
- **Workout Management**: Manage workout plans and exercise history.
- **Metrics Tracking**: Record and retrieve client metrics for progress tracking.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (or any other database you choose to configure)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the server directory:

   ```
   cd trainertrack/server
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Configuration

- Update the database configuration in `config/db.js` to connect to your MongoDB instance.
- Configure authentication settings in `config/auth.js`.

### Running the Server

To start the server, run:

```
npm start
```

The server will run on `http://localhost:5000` by default.

### API Endpoints

- **Authentication**
  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/register`: Register a new user.

- **Clients**
  - `GET /api/clients`: Retrieve all clients.
  - `POST /api/clients`: Create a new client.
  - `GET /api/clients/:id`: Retrieve a specific client.
  - `PUT /api/clients/:id`: Update a specific client.
  - `DELETE /api/clients/:id`: Delete a specific client.

- **Workouts**
  - `GET /api/workouts`: Retrieve all workouts.
  - `POST /api/workouts`: Create a new workout.
  - `GET /api/workouts/:id`: Retrieve a specific workout.
  - `PUT /api/workouts/:id`: Update a specific workout.
  - `DELETE /api/workouts/:id`: Delete a specific workout.

- **Metrics**
  - `GET /api/metrics`: Retrieve all metrics.
  - `POST /api/metrics`: Create new metrics for a client.
  - `GET /api/metrics/:id`: Retrieve metrics for a specific client.
  - `PUT /api/metrics/:id`: Update metrics for a specific client.
  - `DELETE /api/metrics/:id`: Delete metrics for a specific client.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.