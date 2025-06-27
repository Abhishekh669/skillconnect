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