

export type GetEmployeesOptions = {
    page ?: number,
    limit ?: number, 
    search ?: string,
    minHourRate ?: number,
    maxHourRate ?: number,
    minRating ?: number,
    address ?: string,
    radius ?: number,
    jobCategory ?: string
}