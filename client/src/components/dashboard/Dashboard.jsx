import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Header from './Header';
import SummaryStats from './SummaryStats';
import StudentCard from './StudentCard';
import TeacherCard from './TeacherCard';
import SubjectCard from './SubjectCard';
import ExportModal from '../export/ExportModal';

const Dashboard = ({ data }) => {
  const [showExportModal, setShowExportModal] = useState(false);

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
      
      {/* Export Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          ส่งออกข้อมูล
        </button>
      </div>

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

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={data}
        />
      )}
    </div>
  );
};

export default Dashboard;