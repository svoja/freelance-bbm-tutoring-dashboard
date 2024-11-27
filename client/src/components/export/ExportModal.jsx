import React, { useState, useMemo } from 'react';
import { X, Download, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

const translations = {
  exportTitle: 'ส่งออกข้อมูล Excel',
  selectColumns: 'เลือกคอลัมน์',
  selectSubjects: 'เลือกวิชา',
  addSubject: 'เพิ่มวิชา',
  export: 'ส่งออก',
  cancel: 'ยกเลิก',
  preview: 'แสดงตัวอย่าง',
  hidePreview: 'ซ่อนตัวอย่าง',
  previewTitle: 'ตัวอย่างข้อมูล',
  defaultColumns: [
    { key: 'no', label: 'ลำดับ', enabled: true },
    { key: 'id', label: 'รหัสนักเรียน', enabled: true },
    { key: 'name', label: 'ชื่อ-นามสกุล', enabled: true },
    { key: 'condition', label: 'เงื่อนไข', enabled: false },
    { key: 'teacher', label: 'ครูผู้สอน', enabled: false },
    { key: 'date1', label: 'วันเรียนที่ 1', enabled: false },
    { key: 'date2', label: 'วันเรียนที่ 2', enabled: false }
  ]
};

const PreviewSection = ({ data, columns, subject }) => {
  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <div className="bg-blue-500 text-white p-3 text-center font-bold">
        {subject}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.filter(col => col.enabled).map((col, index) => (
                <th key={index} className="p-2 bg-gray-100 border">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row, index) => (
              <tr key={index}>
                {columns
                  .filter(col => col.enabled)
                  .map((col, colIndex) => (
                    <td key={colIndex} className="p-2 border text-sm">
                      {row[col.key]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExportModal = ({ isOpen, onClose, data }) => {
  const [selectedColumns, setSelectedColumns] = useState(translations.defaultColumns);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const subjects = useMemo(() => {
    const subjectSet = new Set();
    if (data?.data?.events) {
      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            if (student.class_name) subjectSet.add(student.class_name);
          });
        });
      });
    }
    return Array.from(subjectSet);
  }, [data]);

  const processDataForExport = () => {
    const exportData = {};

    selectedSubjects.forEach(subject => {
      const studentsInSubject = new Map();
      let studentDates = new Map();

      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            if (student.class_name === subject) {
              const studentId = student.bbm_id;
              if (!studentDates.has(studentId)) {
                studentDates.set(studentId, []);
              }
              studentDates.get(studentId).push(`${student.day} ${student.day_hours}`);

              if (!studentsInSubject.has(studentId)) {
                studentsInSubject.set(studentId, {
                  id: studentId,
                  name: student.title,
                  condition: student.student_condition || '',
                  teacher: student.teacher_name
                });
              }
            }
          });
        });
      });

      const studentArray = Array.from(studentsInSubject.values()).map((student, index) => ({
        no: index + 1,
        ...student,
        date1: studentDates.get(student.id)[0] || '',
        date2: studentDates.get(student.id)[1] || ''
      }));

      exportData[subject] = studentArray;
    });

    return exportData;
  };

const handleExport = () => {
    const exportData = processDataForExport();
    const workbook = XLSX.utils.book_new();
    const allData = [];
    let currentRow = 0;

    selectedSubjects.forEach((subject) => {
      const data = exportData[subject];
      
      // Add empty row between subjects except for first subject
      if (currentRow > 0) {
        allData.push(Array(selectedColumns.filter(col => col.enabled).length).fill(""));
        currentRow++;
      }

      // Add subject header
      allData.push([subject]); // Subject name row
      currentRow++;

      // Add column headers
      const columnHeaders = selectedColumns
        .filter(col => col.enabled)
        .map(col => col.label);
      allData.push(columnHeaders);
      currentRow++;

      // Add data
      data.forEach(student => {
        const row = selectedColumns
          .filter(col => col.enabled)
          .map(col => student[col.key]);
        allData.push(row);
        currentRow++;
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(allData);

    // Style and merge cells for each subject section
    let currentHeaderRow = 0;
    selectedSubjects.forEach((subject, index) => {
      if (index > 0) currentHeaderRow++; // Skip the empty row

      // Set merge for subject header
      const columnCount = selectedColumns.filter(col => col.enabled).length;
      worksheet['!merges'] = worksheet['!merges'] || [];
      worksheet['!merges'].push({
        s: { r: currentHeaderRow, c: 0 },
        e: { r: currentHeaderRow, c: columnCount - 1 }
      });

      // Style subject header
      const subjectCell = XLSX.utils.encode_cell({ r: currentHeaderRow, c: 0 });
      worksheet[subjectCell].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };

      // Style column headers
      const headerRow = currentHeaderRow + 1;
      selectedColumns
        .filter(col => col.enabled)
        .forEach((_, index) => {
          const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: index });
          worksheet[cellRef].s = {
            font: { bold: true },
            fill: { patternType: "solid", fgColor: { rgb: "E9EDF4" } },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        });

      // Update current header row for next subject
      currentHeaderRow += exportData[subject].length + 2; // +2 for headers
    });

    // Set column widths
    const columnWidths = selectedColumns
      .filter(col => col.enabled)
      .map(col => {
        switch(col.key) {
          case 'no': return { wch: 8 };
          case 'name': return { wch: 30 };
          case 'date1':
          case 'date2': return { wch: 25 };
          default: return { wch: 15 };
        }
      });
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Report');
    XLSX.writeFile(workbook, 'student_subjects_report.xlsx');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{translations.exportTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Column Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{translations.selectColumns}</h3>
            <div className="space-y-2">
              {selectedColumns.map((col, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={col.enabled}
                    onChange={() => {
                      const newColumns = [...selectedColumns];
                      newColumns[index] = { ...col, enabled: !col.enabled };
                      setSelectedColumns(newColumns);
                    }}
                    className="rounded"
                  />
                  <span>{col.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">{translations.selectSubjects}</h3>
            <div className="grid grid-cols-2 gap-4">
              {subjects.map(subject => (
                <div
                  key={subject}
                  className={`p-3 border rounded-lg cursor-pointer flex items-center gap-2
                    ${selectedSubjects.includes(subject) ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => {
                    setSelectedSubjects(prev => 
                      prev.includes(subject) 
                        ? prev.filter(s => s !== subject)
                        : [...prev, subject]
                    );
                  }}
                >
                  <div className="flex-1">{subject}</div>
                  {selectedSubjects.includes(subject) && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && selectedSubjects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">{translations.previewTitle}</h3>
              {selectedSubjects.map(subject => (
                <PreviewSection
                  key={subject}
                  subject={subject}
                  data={processDataForExport()[subject]}
                  columns={selectedColumns}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            {showPreview ? translations.hidePreview : translations.preview}
          </button>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              {translations.cancel}
            </button>
            <button
              onClick={handleExport}
              disabled={selectedSubjects.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              {translations.export}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;