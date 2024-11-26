const express = require('express');
const { 
  getSchedule, 
  getStats, 
  getStudentSchedule, 
  getTeacherSchedule 
} = require('../controllers/scheduleController');

const router = express.Router();

// Base routes
router.get('/', getSchedule);
router.get('/stats', getStats);

// Student routes
router.get('/student/:studentId', getStudentSchedule);

// Teacher routes
router.get('/teacher/:teacherId', getTeacherSchedule);

module.exports = router;