export interface CreateAppointmentType{
    customerId : string,
    employeeProfileId : string,
    employeeId : string,
    actualPrice : number,
    offeredPrice : number, 
    timeRequired : number,
    deadline : Date,
    description : string
}


export interface AppointmentSchema{
    _id : string,
    customerId : string,
    employeeProfileId : string,
    employeeId : string,
    actualPrice : number,
    offeredPrice : number,
    companyCommissionPrice : number,
    commissionStatus : boolean,
    timeRequired : number,
    deadline : Date,
    requestStatus : "accepted" | "rejected" | "not-responded",
    workStatus : "pending" | "progress" | "done",
    workFixDate ?: Date,
    description : string
    createdAt : Date,
    updatedAt : Date
}