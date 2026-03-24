import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  User,
  FileText,
  ArrowUpDown,
  Eye,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Myleaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {

 try{

  const user = JSON.parse(localStorage.getItem("user"))

  if(!user?.id) return

  const res = await fetch(
   `${import.meta.env.VITE_BACKEND_URL}/api/leave/user/${user.id}`
  )

  const data = await res.json()

  setLeaves(data)

 }
 catch(error){

  console.error("Error fetching leaves:",error)

 }
 finally{

  setLoading(false)

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
    fetchLeaves()

  } catch (error) {

    console.error("Error deleting leave", error)

  }

}

  const getStatusConfig = (status) => {
    switch(status) {
      case 'APPROVED':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          label: 'Approved'
        };
      case 'PENDING':
        return { 
          icon: Clock, 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          label: 'Pending'
        };
      case 'REJECTED':
        return { 
          icon: XCircle, 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          label: 'Rejected'
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          label: status
        };
    }
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'vacation':
        return 'text-blue-600 bg-blue-100';
      case 'sick':
        return 'text-green-600 bg-green-100';
      case 'family':
        return 'text-purple-600 bg-purple-100';
      case 'emergency':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const filterLeaves = () => {
    let filtered = leaves;
    
    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(leave => leave.status === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(leave => 
        leave.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'days') {
        comparison = a.days - b.days;
      } else if (sortBy === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  const getStatusCount = () => {
    return {
      all: leaves.length,
      approved: leaves.filter(l => l.status === 'APPROVED').length,
      pending: leaves.filter(l => l.status === 'PENDING').length,
      rejected: leaves.filter(l => l.status === 'REJECTED').length,
    };
  };

  const statusCount = getStatusCount();
  const filteredLeaves = filterLeaves();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your leaves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Leaves</h1>
        <p className="text-gray-600 mt-1">View and manage all your leave requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Leaves</p>
              <p className="text-2xl font-bold text-gray-900">{statusCount.all}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CalendarDays size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-600">{statusCount.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCount.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{statusCount.rejected}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Status Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({statusCount.all})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'APPROVED'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({statusCount.approved})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCount.pending})
            </button>
            <button
              onClick={() => setFilterStatus('REJECTED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'REJECTED'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCount.rejected})
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by type or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
              >
                <option value="date">Sort by Date</option>
                <option value="days">Sort by Days</option>
                <option value="type">Sort by Type</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowUpDown size={16} />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
      </div>

      {/* Leaves List */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <CalendarDays size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No leaves found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'ALL' 
              ? "No leaves match your filters" 
              : "You haven't submitted any leave requests yet"}
          </p>
          {!searchTerm && filterStatus === 'ALL' && (
            <Link to="/dashboard/request-leave">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                Request Leave
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeaves.map((leave) => {
            const StatusIcon = getStatusConfig(leave.status).icon;
            const statusConfig = getStatusConfig(leave.status);
            
            return (
              <div
                key={leave._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedLeave(leave);
                  setShowModal(true);
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(leave.type)}`}>
                        {leave.type || 'Unspecified'}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(leave.createdAt)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(leave.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(leave.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-900">{leave.days} day(s)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <FileText size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reason</p>
                      <p className="text-sm text-gray-700">{leave.reason || 'No reason provided'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Leave Details */}
      {showModal && selectedLeave && (
        <div className="fixed inset-0 backdrop-blur-xl backdrop-brightness-40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">Leave Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg ${getStatusConfig(selectedLeave.status).bgColor}`}>
                <div className="flex items-center gap-2">
                  {React.createElement(getStatusConfig(selectedLeave.status).icon, { 
                    size: 20, 
                    className: getStatusConfig(selectedLeave.status).color 
                  })}
                  <span className={`font-semibold ${getStatusConfig(selectedLeave.status).color}`}>
                    Status: {getStatusConfig(selectedLeave.status).label}
                  </span>
                </div>
              </div>
              
              {/* Leave Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Leave Type</label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{selectedLeave.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Duration</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedLeave.days} day(s)</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Start Date</label>
                  <p className="text-gray-900">{formatDate(selectedLeave.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">End Date</label>
                  <p className="text-gray-900">{formatDate(selectedLeave.endDate)}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Reason</label>
                  <p className="text-gray-900 mt-1">{selectedLeave.reason || 'No reason provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Request ID</label>
                  <p className="text-sm text-gray-600 font-mono">{selectedLeave._id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Submitted On</label>
                  <p className="text-gray-900">{formatDate(selectedLeave.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {selectedLeave.status === 'PENDING' && (
                <button
                  onClick={() => {
                    // Add edit functionality here
                    setShowModal(false);
                    handleDeleteLeave(selectedLeave._id)
                  }}
                  
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Cancel Leave"
                >
                  <Trash2 size={20}/>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myleaves;