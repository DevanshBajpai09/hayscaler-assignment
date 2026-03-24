import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  List,
  Grid,
  Filter,
  Download,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useEffect } from "react";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, list
  // eslint-disable-next-line no-unused-vars
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [leaveEvents,setLeaveEvents] = useState([])
// eslint-disable-next-line no-unused-vars
const [loading,setLoading] = useState(true)

useEffect(()=>{

 const fetchLeaves = async ()=>{

  try{

   const user = JSON.parse(localStorage.getItem("user"))

   if(!user?.id) return

   const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/leave/user/${user.id}`
   )

   const data = await res.json()

   // convert backend leaves into calendar events
   const events = data.map((leave)=>({
    date: leave.startDate.split("T")[0],
    type: leave.type,
    employee: user.name,
    status: leave.status.toLowerCase(),
    days: leave.days
   }))

   setLeaveEvents(events)

  }catch(error){

   console.error("Error fetching leaves",error)

  }finally{

   setLoading(false)

  }

 }

 fetchLeaves()

},[])

  // Mock leave data
  

  const getLeaveTypeColor = (type) => {
    switch(type) {
      case "vacation": return "bg-blue-100 text-blue-700 border-blue-200";
      case "sick": return "bg-green-100 text-green-700 border-green-200";
      case "personal": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return <CheckCircle size={12} className="text-green-600" />;
      case "pending": return <Clock size={12} className="text-yellow-600" />;
      case "rejected": return <XCircle size={12} className="text-red-600" />;
      default: return <AlertCircle size={12} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = leaveEvents.filter(event => event.date === dateStr);
      
      if (dayEvents.length > 0) {
        return (
          <div className="mt-1 space-y-0.5">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div 
                key={idx}
                className={`text-xs px-1 py-0.5 rounded ${getLeaveTypeColor(event.type)}`}
              >
                {event.employee.split(' ')[0]}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile class name
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasEvents = leaveEvents.some(event => event.date === dateStr);
      if (hasEvents) {
        return 'bg-indigo-50 hover:bg-indigo-100';
      }
    }
    return '';
  };

  const upcomingLeaves = leaveEvents.filter(event => 
    new Date(event.date) >= new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const getLeaveStats = () => {
    const total = leaveEvents.length;
    const approved = leaveEvents.filter(e => e.status === "approved").length;
    const pending = leaveEvents.filter(e => e.status === "pending").length;
    const rejected = leaveEvents.filter(e => e.status === "rejected").length;
    return { total, approved, pending, rejected };
  };

  const stats = getLeaveStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leave Calendar</h1>
              <p className="text-gray-600 mt-1">Track and manage team leaves at a glance</p>
            </div>
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Leaves</span>
              <CalendarIcon size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Approved</span>
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Pending</span>
              <Clock size={18} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Rejected</span>
              <XCircle size={18} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-semibold text-gray-900">
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-lg transition-colors ${
                        showFilters ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-white'
                      }`}
                    >
                      <Filter size={18} />
                    </button>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setView("month")}
                        className={`p-1.5 rounded transition-colors ${
                          view === "month" ? "bg-white shadow-sm" : "hover:bg-white/50"
                        }`}
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setView("list")}
                        className={`p-1.5 rounded transition-colors ${
                          view === "list" ? "bg-white shadow-sm" : "hover:bg-white/50"
                        }`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-4">
                <Calendar
                  onChange={setDate}
                  value={date}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  className="w-full border-0 shadow-none"
                  prevLabel={<ChevronLeft size={16} />}
                  nextLabel={<ChevronRight size={16} />}
                  prev2Label={null}
                  next2Label={null}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CalendarIcon size={18} className="text-indigo-600" />
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="space-y-2">
                {leaveEvents.filter(event => 
                  event.date === selectedDate.toISOString().split('T')[0]
                ).length > 0 ? (
                  leaveEvents
                    .filter(event => event.date === selectedDate.toISOString().split('T')[0])
                    .map((event, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{event.employee}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className={`px-2 py-0.5 rounded ${getLeaveTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          <span>{event.days} day(s)</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No leaves scheduled for this day
                  </p>
                )}
              </div>
            </div>

            {/* Upcoming Leaves */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Upcoming Leaves</h3>
              <div className="space-y-3">
                {upcomingLeaves.slice(0, 5).map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="shrink-0 w-12 text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{event.employee}</span>
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded ${getLeaveTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className="text-gray-500">{event.days} day(s)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Leave Types</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Vacation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Sick Leave</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Personal Leave</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .react-calendar__navigation {
          display: none;
        }
        
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75rem;
          color: #6b7280;
          padding: 0.5rem 0;
        }
        
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
        }
        
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        
        .react-calendar__tile {
          padding: 0.75rem;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        
        .react-calendar__tile:enabled:hover {
          background-color: #f3f4f6;
        }
        
        .react-calendar__tile--active {
          background-color: #6366f1 !important;
          color: white;
        }
        
        .react-calendar__tile--now {
          background-color: #eef2ff;
        }
        
        .react-calendar__tile--now.react-calendar__tile--active {
          background-color: #6366f1 !important;
        }
        
        @media (max-width: 768px) {
          .react-calendar__tile {
            height: 80px;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}