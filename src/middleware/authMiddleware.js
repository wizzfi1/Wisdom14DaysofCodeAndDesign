const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    // 2. Verify token exists
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    // 3. Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user to request
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};

module.exports = { protect };