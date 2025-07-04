import { create } from 'zustand';

interface PaymentStoreType{
    appointmentId : string | null,
    paymentMethod : "esewa" | "khalti" | null,
    amountData : amountDataType | null,
    setAmountData : (data : amountDataType) => void,
    resetAmountData : () => void,
    setPaymentMethod : (method : "esewa" | "khalti") => void,
    resetPaymentMethod : () => void,
    setAppointmentId : (id : string) => void
    resetAppointmentId : () => void,

}

interface amountDataType {
    commissionAmount : number ,
    offeredAmount : number ,
}


export const useEmployeePaymentStore = create<PaymentStoreType>((set) => ({
    appointmentId : null,
    paymentMethod : null,
    amountData : null,
    setAmountData : (data ) => set({amountData : data}),
    resetAmountData : () => set({amountData : null}),
    setPaymentMethod : (method) => set({paymentMethod : method}),
    resetPaymentMethod : () => set({paymentMethod : null}),
    setAppointmentId : (id) => set({appointmentId : id}),
    resetAppointmentId : () => set({appointmentId : null})
}));


