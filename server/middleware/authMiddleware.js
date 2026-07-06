const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyforjwtshopezapplication123!');

      // Try to find user in User collection
      let user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        req.userType = user.userType;
        return next();
      }

      // Try to find in Admin collection if not found in User
      let admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.user = admin;
        req.userType = 'admin';
        return next();
      }

      return res.status(401).json({ error: 'User/Admin not found' });
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied, Admin authorization required' });
  }
};

module.exports = { protect, isAdmin };
