import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    console.log('📩 POST /api/expenzo/users/register payload:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.warn('Register validation failed - missing fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      console.warn('Register attempt for existing user:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = await User.create({ email: normalizedEmail, password });

    console.log('User created:', newUser._id);
    return res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    console.log('📩 POST /api/expenzo/users/login payload:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.warn('Login validation failed - missing fields');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.warn('Login attempt failed - user not found:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('Login attempt failed - wrong password for user:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Success → send token
    console.log('User logged in:', user._id);
    return res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
