"use client";

import { useEmployeePaymentStore } from '@/lib/store/employee/payment/use-payment-store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { intiatePaymentAction } from '@/lib/actions/payment/post/payment.post';
import toast from 'react-hot-toast';

const Page = () => {
  const router = useRouter();
  const { appointmentId, paymentMethod, amountData } = useEmployeePaymentStore();
  
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!appointmentId || !amountData) {
      router.replace("/employee/appointments");
      return;
    }

  }, [appointmentId, paymentMethod,  router, amountData]);

  const handlePaymentGateWay = async() =>{
        if(!appointmentId)return;
        const response = await intiatePaymentAction(appointmentId);
        console.log("this is hte repsones : ",response)
        const url = response.url;
        if(!url){
          toast.error("failed to initiate payment")
        }
        console.log("this is the response after this : ",response)
        window.location.href = response.url;
  }

  if (!amountData) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Payment Summary</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offeredAmount">Offered Amount ($)</Label>
            <Input
              id="offeredAmount"
              value={amountData.offeredAmount}
              readOnly
              className="font-medium text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commission">Company Commission ($)</Label>
            <Input
              id="commission"
              value={amountData.commissionAmount}
              readOnly
              className="font-medium text-gray-900"
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="total">Net Amount ($)</Label>
            <Input
              id="total"
              value={amountData.offeredAmount - amountData.commissionAmount}
              readOnly
              className="font-bold text-lg text-primary"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full"
           onClick={handlePaymentGateWay}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;