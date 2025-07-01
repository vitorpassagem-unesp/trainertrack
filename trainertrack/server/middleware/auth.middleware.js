const jwt = require('jsonwebtoken');
const config = require('../config/auth');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const authHeader = req.headers['authorization'];
        let token = authHeader;

        if (!authHeader) {
            return res.status(403).send({ message: 'No token provided!' });
        }

        // Extract token from "Bearer token" format
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');
        
        // Find the user and attach to request
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send({ message: 'User not found!' });
        }

        // Save user data for use in other routes
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.user = user; // Attach full user object
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

module.exports = authMiddleware;