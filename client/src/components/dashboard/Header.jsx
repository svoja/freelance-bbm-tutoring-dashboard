import React from 'react';

const Header = ({ dateRange }) => {
  return (
    <header className="mt-5">
      <div className="text-center">
        <h2 className="font-bold text-2xl">BAANBAIMAI DASHBOARD</h2>
        <p className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Made by Phanu
        </p>
        <p className="text-gray-500 text-sm mt-3">
          ข้อมูลจากวันที่ {dateRange.startDate} ถึง {dateRange.endDate}
        </p>
      </div>
    </header>
  );
};

export default Header;