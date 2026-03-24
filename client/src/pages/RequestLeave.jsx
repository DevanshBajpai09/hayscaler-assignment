import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  FileText, 
  Send, 
  Briefcase, 
  Heart, 
  Baby, 
  Plane, 
  AlertCircle,
  ChevronLeft,
  CheckCircle
} from "lucide-react";

export default function RequestLeave() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const leaveTypes = [
    { value: "vacation", label: "Vacation", icon: Plane, color: "text-blue-600", bgColor: "bg-blue-100" },
    { value: "sick", label: "Sick Leave", icon: Heart, color: "text-green-600", bgColor: "bg-green-100" },
    { value: "personal", label: "Personal Leave", icon: Briefcase, color: "text-purple-600", bgColor: "bg-purple-100" },
    { value: "family", label: "Family Emergency", icon: Baby, color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!type) newErrors.type = "Please select a leave type";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!reason.trim()) newErrors.reason = "Please provide a reason";
    if (reason.trim().length < 10) newErrors.reason = "Please provide a detailed reason (minimum 10 characters)";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const submit = async () => {

 if (!validateForm()) return;

 setIsSubmitting(true);

 try{

  const user = JSON.parse(localStorage.getItem("user"))

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leave/request`,{

   method:"POST",

   headers:{
    "Content-Type":"application/json"
   },

   body:JSON.stringify({
    userId:user.id,
    type,
    reason,
    startDate,
    endDate,
    days:calculateDays()
   })

  })

  const data = await res.json()

  if(!res.ok){
   alert(data.message)
   setIsSubmitting(false)
   return
  }

  setIsSubmitting(false)
  setShowSuccess(true)

  setTimeout(()=>{

   setShowSuccess(false)
   navigate("/dashboard")

  },2000)

 }catch(error){

  console.log(error)
  setIsSubmitting(false)

 }

}

  

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Request Leave</h1>
            <p className="text-indigo-100">Submit your leave request for approval</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mx-8 mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Leave Request Submitted Successfully!</p>
                <p className="text-green-600 text-sm">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="p-8 space-y-6">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Leave Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {leaveTypes.map((leaveType) => {
                  const Icon = leaveType.icon;
                  const isSelected = type === leaveType.value;
                  return (
                    <button
                      key={leaveType.value}
                      type="button"
                      onClick={() => setType(leaveType.value)}
                      className={`
                        p-3 rounded-xl border-2 transition-all text-center
                        ${isSelected 
                          ? `${leaveType.bgColor} border-${leaveType.color.split('-')[1]}-500 shadow-md` 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                    >
                      <Icon 
                        size={24} 
                        className={`mx-auto mb-2 ${isSelected ? leaveType.color : 'text-gray-400'}`} 
                      />
                      <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                        {leaveType.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.type && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.type}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`
                      w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                      ${errors.startDate ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`
                      w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                      ${errors.endDate ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Days Calculated */}
            {startDate && endDate && !errors.endDate && (
              <div className="bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
                <span className="text-indigo-700 font-medium">Total Leave Days:</span>
                <span className="text-2xl font-bold text-indigo-600">{calculateDays()}</span>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Leave
              </label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  placeholder="Please provide detailed reason for your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  className={`
                    w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none
                    ${errors.reason ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              </div>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
              {reason && !errors.reason && (
                <p className="mt-1 text-xs text-green-600">
                  ✓ {reason.length}/10 characters minimum
                </p>
              )}
            </div>

            {/* Leave Balance Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Leave Balance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Leave:</span>
                  <span className="font-medium text-gray-900">12 days remaining</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sick Leave:</span>
                  <span className="font-medium text-gray-900">5 days remaining</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                }
                text-white
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Leave Request</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">Important Information</p>
              <p className="text-xs text-blue-700">
                Please submit leave requests at least 3 days in advance. All requests are subject to approval by your manager.
                You will receive a notification once your request is processed.
              </p>
            </div>
          </div>
        </div>
      </div>

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