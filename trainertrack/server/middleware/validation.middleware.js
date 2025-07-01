module.exports = {
    validateClientData: (req, res, next) => {
        const { name, email, metrics } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required and must be a string.' });
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'A valid email is required.' });
        }

        if (metrics && typeof metrics !== 'object') {
            return res.status(400).json({ error: 'Metrics must be an object.' });
        }

        next();
    },

    validateMetricsData: (req, res, next) => {
        const { weight, height, bodyFat, muscleMass } = req.body;

        if (weight && (typeof weight !== 'number' || weight <= 0)) {
            return res.status(400).json({ error: 'Weight must be a positive number.' });
        }

        if (height && (typeof height !== 'number' || height <= 0)) {
            return res.status(400).json({ error: 'Height must be a positive number.' });
        }

        if (bodyFat && (typeof bodyFat !== 'number' || bodyFat < 0 || bodyFat > 100)) {
            return res.status(400).json({ error: 'Body fat percentage must be between 0 and 100.' });
        }

        if (muscleMass && (typeof muscleMass !== 'number' || muscleMass < 0)) {
            return res.status(400).json({ error: 'Muscle mass must be a non-negative number.' });
        }

        next();
    }
};