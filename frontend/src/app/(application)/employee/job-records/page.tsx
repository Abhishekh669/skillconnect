'use client';

import React, { useState } from 'react';
import { useGetEmployeeAppointmentRecords } from '@/lib/hooks/tanstack/query-hook/appointments/use-get-employee-appointment-records';
import { Clock, Calendar, DollarSign, CheckCircle, XCircle, AlertCircle, Loader2, User, Trash2, FileText, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { AppointmentSchema } from '@/lib/types/appointment/appointment.types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetRejectedAppointments } from '@/lib/hooks/tanstack/query-hook/employee/useGetRejectedAppointments';

interface RejectedAppointment {
  _id: string;
  employeeId: string;
  customerId: string;
  offeredPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function Page() {
  const { data: records, isLoading, error } = useGetEmployeeAppointmentRecords();
  const { data: rejectedData, isLoading: rejectedLoading } = useGetRejectedAppointments();
  const [activeTab, setActiveTab] = useState<'records' | 'rejected'>('records');

  console.log("this is the rejected data: ", rejectedData);

  if (isLoading || rejectedLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 max-w-md bg-red-50 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-800">Error Loading Appointments</h2>
          <p className="text-red-600 mt-2">Failed to fetch appointment records. Please try again later.</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending Response
          </span>
        );
    }
  };

  const getWorkStatusBadge = (status: string) => {
    switch (status) {
      case 'progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            In Progress
          </span>
        );
      case 'done':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Pending
          </span>
        );
    }
  };

  const JobRecordsTab = () => {
    if (!records || records.appointments.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center p-6 max-w-md">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">No Job Records Found</h2>
            <p className="text-gray-600 mt-2">You don't have any job records yet.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {records.appointments.map((record: AppointmentSchema) => (
          <div
            key={record._id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {record.description.substring(0, 30)}{record.description.length > 30 ? '...' : ''}
                </h3>
                <div className="flex space-x-2">
                  {getStatusBadge(record.requestStatus)}
                  {getWorkStatusBadge(record.workStatus)}
                </div>
              </div>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Offered Price</p>
                    <p className="text-sm font-medium text-gray-900">
                      Rs. {record.offeredPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="text-sm font-medium text-gray-900">
                      Rs. {record.companyCommissionPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Time Required</p>
                    <p className="text-sm font-medium text-gray-900">
                      {record.timeRequired} hour{record.timeRequired !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(record.deadline), 'MMM dd, yyyy hh:mm a')}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Link href={`/employee/job-records/${record._id}`}>
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Appointment Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.commissionStatus
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Commission: {record.commissionStatus ? 'Paid' : 'Unpaid'}
                </span>
                <span className="text-xs">
                  Created: {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RejectedAppointmentsTab = () => {
    if (!rejectedData || !rejectedData.rejectedAppointments || rejectedData.rejectedAppointments.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center p-6 max-w-md">
            <UserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">No Rejected Appointments</h2>
            <p className="text-gray-600 mt-2">You haven't rejected any appointments yet.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rejectedData.rejectedAppointments.map((rejection: RejectedAppointment) => (
          <div
            key={rejection._id}
            className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                  Rejected Appointment
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <XCircle className="mr-1 h-3 w-3" />
                  Rejected
                </span>
              </div>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Offered Price</p>
                      <p className="text-lg font-bold text-red-700">
                        Rs. {rejection.offeredPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Customer ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {rejection.customerId.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Rejected On</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(rejection.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(rejection.createdAt), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="text-xs">
                  ID: {rejection._id.slice(-8)}
                </span>
                <span className="text-xs">
                  Updated: {format(new Date(rejection.updatedAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your appointments and view rejection history
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('records')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Job Records
                {records && records.appointments && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {records.appointments.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'rejected'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <UserX className="h-4 w-4 mr-2" />
                Rejected Appointments
                {rejectedData && rejectedData.rejectedAppointments && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {rejectedData.rejectedAppointments.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'records' ? <JobRecordsTab /> : <RejectedAppointmentsTab />}
        </div>
      </div>
    </div>
  );
}

export default Page;