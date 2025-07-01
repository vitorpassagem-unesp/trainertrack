// server/controllers/auth.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

// Register a new user
async function register(req, res) {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;
    
    console.log('Registration attempt for:', { username, email, firstName, lastName, role });
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    
    // Validate role if provided
    const validRoles = ['user', 'trainer', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'trainer';
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole,
      profile: {
        firstName: firstName || '',
        lastName: lastName || ''
      }
    });
    
    await newUser.save();
    
    console.log('User registered successfully:', username);
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        name: newUser.profile?.firstName && newUser.profile?.lastName 
          ? `${newUser.profile.firstName} ${newUser.profile.lastName}` 
          : newUser.profile?.firstName || newUser.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
}

// Login user
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    console.log('Request body:', req.body);
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', user.username, 'Role:', user.role);
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'fallbacksecretkey',
      { expiresIn: '1h' }
    );
    
    console.log('Login successful for user:', email);
    
    res.status(200).json({
      accessToken: token,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        name: user.profile?.firstName && user.profile?.lastName 
          ? `${user.profile.firstName} ${user.profile.lastName}` 
          : user.profile?.firstName || user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Explicitly export controller methods
module.exports = { register, login };