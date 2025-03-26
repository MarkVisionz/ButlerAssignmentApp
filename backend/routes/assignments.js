const express = require('express');
const router = express.Router();
const {
  getAssignments,
  updateAssignment,
  deleteAllAssignments,
  updateGuestStatus
} = require('../controllers/assignmentsController');

router.get('/', getAssignments);
router.put('/update-assignment', updateAssignment); // Asegúrate que el frontend lo llama a esta ruta
router.delete('/delete-all', deleteAllAssignments);
router.put('/update-status', updateGuestStatus);

module.exports = router;
