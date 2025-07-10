"use client"
import { useGetCustomerAppointmentsRecords } from '@/lib/hooks/tanstack/query-hook/appointments/use-get-customer-appointment-status'
import React, { useState } from 'react'
import { Calendar, Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle, Edit, Trash2 } from 'lucide-react'

// Define types for the appointment data
type Appointment = {
  _id: string;
  customerId: string;
  employeeProfileId?: string;
  employeeId: string;
  actualPrice?: number;
  offeredPrice: number;
  companyCommissionPrice?: number;
  commissionStatus?: boolean;
  timeRequired: number;
  deadline: string;
  requestStatus: 'accepted' | 'pending' | 'rejected';
  workStatus: 'pending' | 'completed' | string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  type?: string;
};

// Fixed RejectedAppointments interface to match usage
interface RejectedAppointments {
  _id: string;
  employeeId: string;
  customerId: string;
  offeredPrice: number;
  createdAt: string; // Changed from Date to string to match formatDate usage
  updatedAt: string; // Changed from Date to string
  __v?: number; // Fixed typo from _v to __v
  type?: string; // Added type field since it's used in the component
}

type AppointmentResponse = {
  appointmentsData: Appointment[];
  rejectedAppointments: RejectedAppointments[]; // Changed from Appointment[] to RejectedAppointments[]
  success: boolean;
  message: string;
};

function JobRecords() {
  const { data } = useGetCustomerAppointmentsRecords();
  const [activeTab, setActiveTab] = useState<'accepted' | 'rejected'>('accepted');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkStatusIcon = (status: string)=> {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCancelAppointment = (appointmentId: string): void => {
    console.log('Canceling appointment:', appointmentId);
  };

  const handleUpdateAppointment = (appointment: Appointment): void => {
    setSelectedAppointment(appointment);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!selectedAppointment) return;
    
    console.log('Updating appointment:', selectedAppointment);
    setShowUpdateModal(false);
    setSelectedAppointment(null);
  };

  const acceptedCount = data.appointmentsData?.length || 0;
  const rejectedCount = data.rejectedAppointments?.length || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Records</h1>
        <p className="text-gray-600">Track your appointment history and status</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('accepted')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'accepted'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accepted ({acceptedCount})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Rejected ({rejectedCount})
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="divide-y divide-gray-200">
          {activeTab === 'accepted' && (
            <>
              {data.appointmentsData && data.appointmentsData.length > 0 ? (
                data.appointmentsData.map((appointment : Appointment) => (
                  <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.requestStatus)}`}>
                            {appointment.requestStatus}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.workStatus)}`}>
                            {getWorkStatusIcon(appointment.workStatus)}
                            <span className="ml-1">{appointment.workStatus}</span>
                          </span>
                          {appointment.type && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                              {appointment.type}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">Deadline: {formatDate(appointment.deadline)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">Time Required: {appointment.timeRequired} hour(s)</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="text-sm">Price: ${appointment.actualPrice}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span className="text-sm">Employee: {appointment.employeeId}</span>
                          </div>
                        </div>
                        
                        {appointment.description && (
                          <div className="mt-3">
                            <p className="text-gray-700 text-sm">
                              <strong>Description:</strong> {appointment.description}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="lg:ml-6 flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${appointment.offeredPrice}</div>
                          <div className="text-sm text-gray-500">Offered Price</div>
                        </div>
                        {appointment.commissionStatus && (
                          <div className="text-right">
                            <div className="text-sm font-medium text-orange-600">${appointment.companyCommissionPrice}</div>
                            <div className="text-xs text-gray-500">Commission</div>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(appointment.createdAt)}
                        </div>
                        
                        {/* Action Buttons for Pending Appointments */}
                        {appointment.requestStatus === 'pending' && (
                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={() => handleUpdateAppointment(appointment)}
                              className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Update
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No accepted appointments found</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'rejected' && (
            <>
              {data.rejectedAppointments && data.rejectedAppointments.length > 0 ? (
                data.rejectedAppointments.map((appointment : RejectedAppointments) => (
                  <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-red-100 text-red-800 border-red-200">
                            Rejected
                          </span>
                          {appointment.type && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                              {appointment.type}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span className="text-sm">Employee: {appointment.employeeId}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="text-sm">Offered Price: ${appointment.offeredPrice}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:ml-6 flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">${appointment.offeredPrice}</div>
                          <div className="text-sm text-gray-500">Offered Price</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(appointment.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No rejected appointments found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Update Appointment</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offered Price
                </label>
                <input
                  type="number"
                  value={selectedAppointment.offeredPrice}
                  onChange={(e) => setSelectedAppointment({
                    ...selectedAppointment,
                    offeredPrice: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={new Date(selectedAppointment.deadline).toISOString().slice(0, 16)}
                  onChange={(e) => setSelectedAppointment({
                    ...selectedAppointment,
                    deadline: new Date(e.target.value).toISOString()
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedAppointment.description || ''}
                  onChange={(e) => setSelectedAppointment({
                    ...selectedAppointment,
                    description: e.target.value
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {acceptedCount}
          </div>
          <div className="text-gray-600">Accepted</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {rejectedCount}
          </div>
          <div className="text-gray-600">Rejected</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {acceptedCount + rejectedCount}
          </div>
          <div className="text-gray-600">Total</div>
        </div>
      </div>
    </div>
  )
}

export default JobRecords
