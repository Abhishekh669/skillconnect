"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { redirect, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEmployeePaymentStore } from "@/lib/store/employee/payment/use-payment-store";

const paymentMethods = [
  { name: "eSewa", color: "bg-green-500" },
  { name: "Khalti", color: "bg-purple-500" },
];

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const { push } = useRouter();
  const {appointmentId, setPaymentMethod, amountData} = useEmployeePaymentStore();

  if(!appointmentId || !amountData) return redirect("/employee/appointments")

  const handlePayment = (method: string) => {
    switch (method) {
      case "eSewa":
        setPaymentMethod("esewa")
        push("/employee/payment/esewa-payment");
        break;
      case "Khalti":
        setPaymentMethod("khalti")
        push("/employee/payment/khalti-payment");
        break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Choose Payment Method</CardTitle>
          <CardDescription className="text-gray-500">
            Select your preferred payment option
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <Button
              key={method.name}
              variant="outline"
              className={cn(
                "w-full h-14 justify-start px-6 py-3 text-left font-normal transition-all",
                "hover:bg-gray-50 hover:border-primary/50",
                selectedMethod === method.name
                  ? "border-2 border-primary bg-primary/10"
                  : "border border-gray-200"
              )}
              onClick={() => setSelectedMethod(method.name)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full ${method.color}`} />
                <span className="text-base font-medium">{method.name}</span>
              </div>
            </Button>
          ))}
        </CardContent>

        <CardFooter>
          <Button
            className={cn(
              "w-full h-12 text-base font-medium",
              "transition-opacity duration-200",
              selectedMethod ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            disabled={!selectedMethod}
            onClick={() => selectedMethod && handlePayment(selectedMethod)}
          >
            Pay with {selectedMethod}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}