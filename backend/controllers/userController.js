const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // For demo, assume password is stored in plain text
    if (user.password !== password) return res.status(401).json({ error: 'Invalid password' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;
  const { page = 1, limit = 10, q = '' } = req.query;
  const query = { role };
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phoneNumber: { $regex: q, $options: 'i' } },
    ];
  }
  try {
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  // Only allow principal to create teachers
  if (req.query.role !== 'principal') {
    return res.status(403).json({ error: 'Only principal can create teachers' });
  }
  const { name, email, phoneNumber, gender, password, role } = req.body;
  if (!name || !email || !phoneNumber || !gender || !password || role !== 'teacher') {
    return res.status(400).json({ error: 'Missing required fields or invalid role' });
  }
  try {
    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const user = new User({ name, email, phoneNumber, gender, password, role });
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 