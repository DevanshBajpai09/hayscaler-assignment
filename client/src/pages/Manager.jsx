import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ManagerCard from "../components/ManagerCard";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Filter,
  Search,
  Download,
  ChevronDown,
  UserCheck,
  Briefcase,
  AlertTriangle,
  BarChart3,
  Award,
  FileText,
  Clock as ClockIcon
} from "lucide-react";

export default function Manager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate API call to fetch leaves
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
  try {

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/leave/all`
    );

    const data = await res.json();

    const formattedLeaves = data.map((leave) => ({
      id: leave._id,
      user: leave.userId?.name || "Unknown",
      type: leave.type,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      days: leave.days,
      status: leave.status.toLowerCase(),
      department: leave.department || "General",
      avatar: leave.userId?.name?.charAt(0) || "U",
      submittedDate: leave.createdAt
    }));

    setLeaves(formattedLeaves);

  } catch (error) {

    console.error("Error fetching leaves", error);

  } finally {

    setLoading(false);

  }
};

  // Stats data
  const stats = [
    {
      title: "Total Requests",
      value: leaves.length,
      icon: CalendarDays,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      
      changeColor: "text-green-600"
    },
    {
      title: "Pending",
      value: leaves.filter(l => l.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      
      changeColor: "text-yellow-600"
    },
    {
      title: "Approved",
      value: leaves.filter(l => l.status === "approved").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      
      changeColor: "text-green-600"
    },
    {
      title: "Rejected",
      value: leaves.filter(l => l.status === "rejected").length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    
      changeColor: "text-red-600"
    },
  ];

  // Department stats
 

  const getStatusCount = (status) => {
    return leaves.filter(leave => leave.status === status).length;
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || leave.status === filterStatus;
    const matchesType = filterType === "all" || leave.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = [...new Set(leaves.map(leave => leave.type))];

  const handleApprove = async (id) => {

  try {

    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/leave/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "APPROVED"
        })
      }
    );

    fetchLeaves();

  } catch (error) {

    console.error("Error approving leave", error);

  }
};

  const handleReject = async (id) => {

  try {

    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/leave/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "REJECTED"
        })
      }
    );

    fetchLeaves();

  } catch (error) {

    console.error("Error rejecting leave", error);

  }
};

  const approvalRate = Math.round(
    (leaves.filter(l => l.status === "approved").length / leaves.length) * 100
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"John Doe","role":"HR Manager"}');

  const navigation = [
    { name: "Dashboard", path: "/manager", icon: LayoutDashboard },
    { name: "Pending Requests", path: "/manager/pending", icon: ClockIcon },
    { name: "All Leaves", path: "/manager/all-leaves", icon: FileText },
    { name: "Manager Calendar", path: "/manager/calendar", icon: CalendarDays },
  ];

  useEffect(() => {
  fetchLeaves();
}, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Manager Portal</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>{item.name}</span>
                  {item.name === "Pending Requests" && getStatusCount("pending") > 0 && (
                    <span className="ml-auto bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full">
                      {getStatusCount("pending")}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.name?.charAt(0) || "JD"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name || "John Doe"}</p>
                <p className="text-xs text-gray-500">{user?.role || "HR Manager"}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find(nav => nav.path === location.pathname)?.name || "Dashboard"}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {location.pathname === "/manager" && "Overview of leave requests and statistics"}
                  {location.pathname === "/manager/pending" && "Review and manage pending leave requests"}
                  {location.pathname === "/manager/all-leaves" && "View all leave requests history"}
                  {location.pathname === "/manager/calendar" && "Calendar view of team leaves"}
                </p>
              </div>
              
              
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {location.pathname === "/manager" && (
            /* Dashboard Home Content */
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all hover:scale-105 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <stat.icon size={24} className={stat.color} />
                      </div>
                      <span className={`text-sm font-semibold ${stat.changeColor}`}></span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions and Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by employee name or reason..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="all">All Types</option>
                      {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    
                    
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leave Requests List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Leave Requests</h2>
                          <p className="text-sm text-gray-500 mt-1">Review and take action on requests</p>
                        </div>
                        <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                          {filteredLeaves.length} request(s)
                        </span>
                      </div>
                    </div>
                    
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading leaves...</p>
                      </div>
                    ) : filteredLeaves.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {filteredLeaves.map((leave) => (
                          <ManagerCard 
                            key={leave.id} 
                            leave={leave} 
                            onApprove={handleApprove}
                            onReject={handleReject}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                          <Search size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No leave requests found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-indigo-600" />
                      Performance Metrics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Approval Rate</span>
                          <span className="font-semibold text-green-600">{approvalRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 rounded-full h-2 transition-all"
                            style={{ width: `${approvalRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600">Pending Reviews</span>
                        <span className="font-semibold text-yellow-600 text-lg">{getStatusCount("pending")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Response Time</span>
                        <span className="font-semibold text-gray-900">4.2 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-semibold text-gray-900">{leaves.length} requests</span>
                      </div>
                    </div>
                  </div>

                  {/* Department Breakdown */}
                  
                  
                </div>
              </div>
            </>
          )}

          {/* Render child routes for other pages */}
          {location.pathname !== "/manager" && (
            <Outlet context={{ leaves, setLeaves, handleApprove, handleReject }} />
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}