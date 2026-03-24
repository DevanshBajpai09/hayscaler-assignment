import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import ManagerCard from '../components/ManagerCard';

export default function PendingRequests() {
  const { leaves, handleApprove, handleReject } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const pendingLeaves = leaves.filter(leave => 
    leave.status === 'pending' &&
    (leave.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
     leave.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {pendingLeaves.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <Clock size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">All leave requests have been reviewed</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
              <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                {pendingLeaves.length} pending
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingLeaves.map((leave) => (
              <ManagerCard 
                key={leave.id} 
                leave={leave} 
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}