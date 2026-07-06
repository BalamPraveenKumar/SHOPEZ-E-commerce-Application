const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyforjwtshopezapplication123!';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// Customer register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const userExists = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (userExists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      userType: 'customer'
    });

    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Customer / Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Try finding in User collection first
    const user = await User.findOne({ username: username.toLowerCase() });
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return res.json({
          message: 'Login successful',
          token: generateToken(user._id),
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            userType: user.userType
          }
        });
      }
    }

    // Try finding in Admin collection
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        return res.json({
          message: 'Login successful',
          token: generateToken(admin._id),
          user: {
            id: admin._id,
            username: admin.username,
            email: 'admin@shopez.com',
            userType: 'admin'
          }
        });
      }
    }

    res.status(401).json({ error: 'Invalid username or password' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login specifically
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check Admin collection first
    let admin = await Admin.findOne({ username: username.toLowerCase() });
    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        return res.json({
          message: 'Admin login successful',
          token: generateToken(admin._id),
          user: {
            id: admin._id,
            username: admin.username,
            userType: 'admin'
          }
        });
      }
    }

    // Check User collection for admin role
    let userAdmin = await User.findOne({ username: username.toLowerCase(), userType: 'admin' });
    if (userAdmin) {
      const isMatch = await userAdmin.comparePassword(password);
      if (isMatch) {
        return res.json({
          message: 'Admin login successful',
          token: generateToken(userAdmin._id),
          user: {
            id: userAdmin._id,
            username: userAdmin.username,
            userType: 'admin'
          }
        });
      }
    }

    res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const userObj = req.user.toObject ? req.user.toObject() : { ...req.user };
    userObj.userType = req.userType;
    res.json({ user: userObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        userType: updatedUser.userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin view all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: 'customer' }).select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
