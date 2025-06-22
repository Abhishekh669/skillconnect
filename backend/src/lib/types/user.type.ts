export interface UserType{
    userId : string,
    username : string,
    email : string,
    image : string,
    userRole : "customer" | "employee" | "admin",
    isOnboarded : boolean,
    location : {    
        type : string,
        coordinates : [number, number],
        address : string,
    },
    employeeProfile : {
        jobCategory : string,
        skills : string,
        hourlyRate : number,
    rating : number,
        userId : string,
        completedJobs : number,
    } | null,
}

export interface CreateUserType{
    userId : string,
    username : string, 
    email : string,
    image : string,
    userRole : "customer" | "employee" |"admin",
    location : {
        type : string,
        coordinate : [number, number],
        address : string,
    }
}