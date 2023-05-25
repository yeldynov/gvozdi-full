const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Session = mongoose.model('Session');

const router = express.Router();

router.use(requireAuth);

router.get('/sessions', async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id });

  res.send(sessions);
});

router.post('/sessions', async (req, res) => {
  const { duration, feedback } = req.body;

  try {
    const session = new Session({
      duration,
      feedback,
      date: Date.now(),
      userId: req.user._id,
    });
    await session.save();
    res.send(session);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete('/sessions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await Session.findByIdAndRemove(id);

    if (!deletedRecord) {
      return res.status(404).send({ error: 'Session not found' });
    }
    res.send({ message: 'Session deleted successfully.' });
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
