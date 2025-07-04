"use client";
import { useEmployeePaymentStore } from '@/lib/store/employee/payment/use-payment-store';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams()
    const data = searchParams.get('data');
    if(!data){
      return redirect("/employee/appointments")
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {/* Failure Icon */}
        <div className="text-red-500 mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>

        {/* Failure Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>

        {/* Additional Help Text */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your transaction was not completed. No amount has been deducted from your account.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Return to Homepage
          </button>
          <button
            onClick={() => {
              toast.success('Redirecting to payment page');
              // Replace with your actual payment page route
              router.push('/payment');
            }}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-md transition duration-200"
          >
            Try Payment Again
          </button>
        </div>

        {/* Support Contact */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <a href="mailto:support@example.com" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}