import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function ManagerCalendar() {
  const { leaves } = useOutletContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

 

  const getLeavesForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leaves.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-200"></div>);
    }
    
    // Fill in actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const leavesForDay = getLeavesForDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(
        <div key={day} className="h-32 border border-gray-200 p-2 hover:bg-gray-50 transition-colors">
          <div className="font-semibold text-gray-700 mb-2">{day}</div>
          <div className="space-y-1">
            {leavesForDay.slice(0, 3).map((leave, idx) => (
              <div key={idx} className="text-xs p-1 rounded bg-indigo-50 text-indigo-700 truncate">
                {leave.user} - {leave.type}
              </div>
            ))}
            {leavesForDay.length > 3 && (
              <div className="text-xs text-gray-500">+{leavesForDay.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Team Calendar</h2>
            <p className="text-sm text-gray-500 mt-1">View all team members' leaves</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {renderCalendar()}
      </div>
    </div>
  );
}