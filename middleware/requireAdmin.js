const requireAdmin = (req, res, next) => {
    if (!req.userRoles || !req.userRoles.includes('Admin')) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};

module.exports = requireAdmin;