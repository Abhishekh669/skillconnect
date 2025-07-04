"use client";
import { verifyPayment } from '@/lib/actions/payment/post/payment.post';
import { base64Decode } from '@/lib/utils/base64-decode';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('data');
  const [verifying, setVerifying] = useState(true);
  
  const [paymentDetails, setPaymentDetails] = useState<{
    status: string;
    referenceId: string;
    paidAmount: number;
    appointmentId  : string;
    success: boolean;
  } | null>(null);

  const decoded = data ? base64Decode(data) : null;
  const appointmentId = decoded?.transaction_uuid;

  useEffect(() => {
    if (!appointmentId) return;
    verifyPaymentStatus();
  }, [appointmentId]);

  const verifyPaymentStatus = async () => {
    if (!appointmentId) {
      toast.error("Invalid transaction");
      return;
    }

    try {
      setVerifying(true);
      const data = {
        appointmentId,
        transaction_code: decoded.transaction_code,
        signature: decoded.signature
      };

      const res = await verifyPayment(data);
      if (res.success) {
        toast.success("Your payment was successful!");
        setPaymentDetails({
          status: res.status,
          referenceId: res.referenceId,
          paidAmount: res.paidAmount,
          appointmentId : res.appointmentId,
          success: res.success
        });
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      toast.error("Failed to verify payment");
      console.error("Payment verification error:", error);
    } finally {
      setVerifying(false);
    }
  };

  if(!data){
    return redirect("/employee/appointments")
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">We couldn't verify your payment details.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="text-green-500 mx-auto mb-4">
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your payment. Your transaction was successful.</p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Transaction Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium">NPR {paymentDetails.paidAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{paymentDetails.referenceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">eSewa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600 capitalize">{paymentDetails.status?.toLowerCase()}</span>
            </div>
          </div>
        </div>


        <button
          onClick={() => router.push(`/employee/job-records/${paymentDetails.appointmentId}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}