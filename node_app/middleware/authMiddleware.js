const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Please Login' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Please Login ' });
    }
    req.user = { userId: decoded.userId };
    next();
  });
};
