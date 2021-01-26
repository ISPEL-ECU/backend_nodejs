module.exports = (req, res, next) => {
    if (!req.session.user.admin) {
        return res.redirect('/auth/login');
    }
    next();
}