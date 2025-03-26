const Assignment = require('../models/Assignment');

exports.deleteAllAssignments = async (req, res) => {
  try {
    await Assignment.deleteMany({});
    res.json({ message: 'All assignments deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignments' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { roomNo, assignedButler } = req.body;

    const existingAssignment = await Assignment.findOne({ roomNo });
    if (!existingAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await Assignment.updateOne({ roomNo }, { assignedButler });
    res.json({ message: 'Assignment updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

exports.updateGuestStatus = async (req, res) => {
  const { name, status } = req.body;

  try {
    const checkedOutTime = status === 'checkedOut' ? new Date() : null;

    await Assignment.updateMany(
      { name },
      { $set: { status, checkedOutTime } }
    );

    res.json({ message: 'Guest status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating guest status' });
  }
};
