const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./db'); // Assuming db.js contains the necessary database configuration

const authConfig = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable or default
    expiresIn: '1d', // Token expiration time
};

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    authConfig,
    generateToken,
    hashPassword,
    comparePassword,
};