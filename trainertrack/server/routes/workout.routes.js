const express = require('express');
const workoutController = require('../controllers/workout.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route to create a new workout
router.post('/', authMiddleware, workoutController.createWorkout);

// Route to get all workouts
router.get('/', authMiddleware, workoutController.getAllWorkouts);

// Route to get current user's workouts
router.get('/my-workouts', authMiddleware, workoutController.getMyWorkouts);

// Route to get workouts by client ID
router.get('/client/:clientId', authMiddleware, workoutController.getWorkoutsByClientId);

// Route to get a specific workout by ID
router.get('/:id', authMiddleware, workoutController.getWorkoutById);

// Route to update a workout by ID
router.put('/:id', authMiddleware, workoutController.updateWorkout);

// Route to delete a workout by ID
router.delete('/:id', authMiddleware, workoutController.deleteWorkout);

module.exports = router;