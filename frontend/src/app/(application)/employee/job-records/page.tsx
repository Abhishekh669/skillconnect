'use client';

import React from 'react';
import { useGetEmployeeAppointmentRecords } from '@/lib/hooks/tanstack/query-hook/appointments/use-get-employee-appointment-records';
import { Clock, Calendar, DollarSign, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { AppointmentSchema } from '@/lib/types/appointment/appointment.types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Page() {
  const { data: records, isLoading, error } = useGetEmployeeAppointmentRecords();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md bg-red-50 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-800">Error Loading Appointments</h2>
          <p className="text-red-600 mt-2">Failed to fetch appointment records. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!records || records.appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">No Appointments Found</h2>
          <p className="text-gray-600 mt-2">You don't have any scheduled appointments yet.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your scheduled appointments in one place
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {records.appointments.map((record : AppointmentSchema) => (
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
                  <div>
                  <Link href={`/employee/job-records/${record._id}`}>
                  <Button>
                        view  appointment data
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
      </div>
    </div>
  );
}

export default Page;