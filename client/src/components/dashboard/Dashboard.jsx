import React from 'react';
import Header from './Header';
import SummaryStats from './SummaryStats';
import StudentCard from './StudentCard';
import TeacherCard from './TeacherCard';
import SubjectCard from './SubjectCard';

const Dashboard = ({ data }) => {
  const getDateRange = () => {
    if (data?.data?.events && data.data.events.length > 0) {
      const startDate = data.data.events[0].date;
      const endDate = data.data.events[data.data.events.length - 1].date;
      return { startDate, endDate };
    }
    return { startDate: '-', endDate: '-' };
  };

  return (
    <div className="container mx-auto px-4">
      <Header dateRange={getDateRange()} />
      
      <div className="py-8">
        <SummaryStats data={data} />
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <StudentCard data={data} />
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <TeacherCard data={data} />
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SubjectCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;