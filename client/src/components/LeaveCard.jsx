// components/LeaveCard.jsx
import { Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function LeaveCard({ leave }) {
  const getStatusIcon = () => {
    switch(leave.status) {
      case "APPROVED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "PENDING":
        return <Clock size={16} className="text-yellow-600" />;
      case "REJECTED":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch(leave.status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{leave.type}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{leave.status}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{leave.days || 1} day(s)</span>
            </div>
          </div>
          
          <div className="flex items-start gap-1 text-sm text-gray-500">
            <FileText size={14} className="mt-0.5" />
            <span>{leave.reason}</span>
          </div>
        </div>
        
        
      </div>
    </div>
  );
}