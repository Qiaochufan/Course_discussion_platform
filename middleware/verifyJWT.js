const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>" -> just the token part

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
            }
            req.userId = decoded.id;
            req.userEmail = decoded.email;
            req.userRoles = decoded.roles;
            next();
        }
    );
};

module.exports = verifyJWT;