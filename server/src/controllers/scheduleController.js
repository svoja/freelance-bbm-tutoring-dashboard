const scheduleData = require('../../data/data_27.json');

const getSchedule = (req, res) => {
  try {
    res.json(scheduleData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = (req, res) => {
  try {
    const stats = {
      totalStudents: new Set(scheduleData.data.events.flatMap(day => 
        day.hours.flatMap(hour => 
          hour.students.map(student => student.bbm_id)
        )
      )).size,
      totalTeachers: new Set(scheduleData.data.events.flatMap(day => 
        day.hours.flatMap(hour => 
          hour.students.map(student => student.teacher_id)
        )
      )).size,
      totalSubjects: new Set(scheduleData.data.events.flatMap(day => 
        day.hours.flatMap(hour => 
          hour.students.map(student => student.class_name)
        )
      )).size
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentSchedule = (req, res) => {
  try {
    const { studentId } = req.params;
    const studentSchedule = scheduleData.data.events.flatMap(day =>
      day.hours.flatMap(hour =>
        hour.students.filter(student => student.bbm_id === studentId)
      )
    );
    
    if (studentSchedule.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(studentSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherSchedule = (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacherSchedule = scheduleData.data.events.flatMap(day =>
      day.hours.flatMap(hour =>
        hour.students.filter(student => student.teacher_id === teacherId)
      )
    );
    
    if (teacherSchedule.length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json(teacherSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSchedule,
  getStats,
  getStudentSchedule,
  getTeacherSchedule
};