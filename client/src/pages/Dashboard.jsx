import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import LeaveCard from "../components/LeaveCard";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Bell,
  Settings,
  LogOut,
  PlusCircle,
  TrendingUp,
  Users,
  Award,
  Trash2
} from "lucide-react";

export default function Dashboard() {
  
  const [dashboard, setDashboard] = useState(null);
  const [user,setUser] = useState(null)
  
  const location = useLocation();

  const fetchDashboard = async () => {

  try {

    const user = JSON.parse(localStorage.getItem("user"))

    if (!user?.id) return

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/${user.id}`
    )

    const data = await res.json()

    setDashboard(data)

  } catch (error) {

    console.error("Error fetching dashboard:", error)

  }

}



const handleDeleteLeave = async (leaveId) => {

  try {

    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/leave/${leaveId}`,
      {
        method: "DELETE"
      }
    )

    // refresh dashboard
    fetchDashboard()

  } catch (error) {

    console.error("Error deleting leave", error)

  }

}

useEffect(() => {

  const storedUser = JSON.parse(localStorage.getItem("user"))

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setUser(storedUser)

  fetchDashboard()

}, [location.pathname])

  

  const stats = dashboard
    ? [
        {
          title: "Total Leaves",
          value: dashboard.stats.total,
          icon: CalendarDays,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        },
        {
          title: "Approved",
          value: dashboard.stats.approved,
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
        },
        {
          title: "Pending",
          value: dashboard.stats.pending,
          icon: Clock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
        },
        {
          title: "Rejected",
          value: dashboard.stats.rejected,
          icon: XCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-600",
        },
      ]
    : [];

 

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Sticky */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
            <LayoutDashboard size={28} className="text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">LeaveFlow</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/dashboard/calendar"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/dashboard/calendar"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CalendarDays size={20} />
              <span>Calendar</span>
            </Link>

            <Link
              to="/dashboard/leaves"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/dashboard/leaves"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CalendarDays size={20} />
              <span>My Leaves</span>
            </Link>
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || "John Doe"}</p>
                <p className="text-xs text-gray-500">{user?.role || "Employee"}</p>
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
        {/* Conditional rendering based on route */}
        {location.pathname === "/dashboard" ? (
          // Dashboard Home Content
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name || "John"}! Here's your leave summary.</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications */}
               
                
                {/* New Leave Button */}
                <Link to="/dashboard/request-leave">
                  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusCircle size={18} />
                    <span>New Leave Request</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon size={24} className={stat.textColor} />
                    </div>
                    <span className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Leave Requests Section - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Recent Leave Requests</h2>
                      <Link to="/dashboard/leaves" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        View All
                      </Link>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">

  {dashboard?.recentLeaves?.map((leave) => (

    <div key={leave._id} className="flex items-center justify-between p-4">

      <LeaveCard leave={leave} />

      {leave.status === "PENDING" && (

        <button
          onClick={() => handleDeleteLeave(leave._id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Cancel Leave"
        >
          <Trash2 size={18} />
        </button>

      )}

    </div>

  ))}

</div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Leave Balance */}
                <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>
                  <div className="space-y-3">
                    {/* Annual Leave */}
                    <div className="flex justify-between items-center">
                      <span>Annual Leave</span>
                      <span className="font-bold">
                        {dashboard?.balance?.annualRemaining ?? 0}/20 days
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2"
                        style={{
                          width: `${((dashboard?.balance?.annualRemaining ?? 0) / 20) * 100}%`
                        }}
                      ></div>
                    </div>

                    {/* Sick Leave */}
                    <div className="flex justify-between items-center mt-3">
                      <span>Sick Leave</span>
                      <span className="font-bold">
                        {dashboard?.balance?.sickRemaining ?? 0}/10 days
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2"
                        style={{
                          width: `${((dashboard?.balance?.sickRemaining ?? 0) / 10) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Leaves */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays size={20} className="text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Upcoming Leaves</h3>
                  </div>
                  <div className="space-y-3">
                    {dashboard?.upcomingLeaves?.map((leave, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{leave.type}</p>
                          <p className="text-xs text-gray-500">{leave.date}</p>
                        </div>
                        <span className="text-sm text-indigo-600">{leave.days} day(s)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Total Leaves Taken */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Leaves Taken</span>
                      <span className="font-semibold text-gray-900">
                        {dashboard?.stats?.approved ?? 0}
                      </span>
                    </div>

                    {/* Pending Requests */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Requests</span>
                      <span className="font-semibold text-yellow-600">
                        {dashboard?.stats?.pending ?? 0}
                      </span>
                    </div>

                    {/* Approval Rate */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Approval Rate</span>
                      <span className="font-semibold text-green-600">
                        {dashboard
                          ? Math.round(
                              (dashboard.stats.approved /
                               ((dashboard.stats.approved + dashboard.stats.rejected) || 1)) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Render child routes (Calendar, My Leaves, etc.)
          <Outlet context={{ dashboard, setDashboard }} />
        )}
      </main>
    </div>
  );
}