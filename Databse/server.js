require('dotenv').config();
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const { requireAuth, requireRole } = require('./middleware/authMiddleware');

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/jobseeker', requireAuth, requireRole('job_seeker'), (req, res) => {
  res.json({ message: `Welcome Job Seeker ${req.user.email}` });
});

app.get('/api/employer', requireAuth, requireRole('employer'), (req, res) => {
  res.json({ message: `Welcome Employer ${req.user.email}` });
});

app.get('/api/admin', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
