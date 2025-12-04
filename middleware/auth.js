const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Simple session-based auth (NO JWT needed)
const getUserId = (req) => {
    // Check cookie/session/localStorage (simple approach)
    return req.headers['x-user-id'] || req.query.userId || 'public-user';
};

module.exports = { getUserId };


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = auth;
