module.exports = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: This action requires one of the following roles: ${roles.join(', ')}`
            });
        }
        next();
    };
};
