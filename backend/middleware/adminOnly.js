module.exports = function adminOnly(req, res, next) {
  // For demo, check for ?role=principal or req.body.role === 'principal'
  const role = req.query.role || req.body.role || (req.user && req.user.role);
  if (role === 'principal') {
    return next();
  }
  return res.status(403).json({ error: 'Only admin (principal) can perform this action.' });
}; 