import { CheckCircle, XCircle, User, Calendar, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

export default function ManagerCard({ leave, onApprove, onReject }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(leave.status || "pending");

  const handleApprove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onApprove?.(leave.id);
      setStatus("approved");
    } catch (error) {
      console.error("Error approving leave:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onReject?.(leave.id);
      setStatus("rejected");
    } catch (error) {
      console.error("Error rejecting leave:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", text: "Approved" };
      case "rejected":
        return { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", text: "Rejected" };
      default:
        return { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-400/30 dark:text-yellow-400", text: "Pending" };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="
      bg-white 
      rounded-lg  border-gray-200 
      hover:shadow-md transition-all duration-300
      group
    ">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {leave.user?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-black">
                {leave.user || "Unknown User"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {leave.type || "Leave"} Leave
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <p className="truncate">{leave.reason || "No reason provided"}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.text}
            </span>

            {/* Action Buttons */}
            {status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="
                    p-1.5 rounded-lg text-green-600 hover:bg-green-50 
                    dark:text-green-400 dark:hover:bg-green-900/30
                    transition-all duration-200 hover:scale-110
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  title="Approve"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="
                    p-1.5 rounded-lg text-red-600 hover:bg-red-50 
                    dark:text-red-400 dark:hover:bg-red-900/30
                    transition-all duration-200 hover:scale-110
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  title="Reject"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}