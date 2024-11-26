import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Thai translations
const translations = {
  totalStudents: 'จำนวนนักเรียนทั้งหมด',
  totalSubjects: 'จำนวนวิชาทั้งหมด',
  totalTeachers: 'จำนวนครูทั้งหมด',
};

const SummaryStats = ({ data }) => {
  // Get quick stats
  const getStats = () => {
    const students = new Set();
    const subjects = new Set();
    const teachers = new Set();

    if (data?.data?.events) {
      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            students.add(student.bbm_id);
            subjects.add(student.class_name);
            teachers.add(student.teacher_name);
          });
        });
      });
    }

    return {
      studentCount: students.size,
      subjectCount: subjects.size,
      teacherCount: teachers.size
    };
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-blue-600">{translations.totalStudents}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{stats.studentCount}</p>
          <p className="text-gray-500 mt-2">คน</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-purple-600">{translations.totalSubjects}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-purple-600">{stats.subjectCount}</p>
          <p className="text-gray-500 mt-2">วิชา</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-green-600">{translations.totalTeachers}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600">{stats.teacherCount}</p>
          <p className="text-gray-500 mt-2">คน</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;