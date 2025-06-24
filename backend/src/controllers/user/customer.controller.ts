import { Request, Response } from "express";
import { GetEmployeesOptions } from "../../lib/types/employee-query";
import { getAllEmployeeForCustomer } from "../../services/user/user.customer.service";


export const getAllEmployeeForCustomerHandler = async (req: Request, res: Response) => {
  try {
    console.log("qeury in rquest :",req.query)
     const queryData: GetEmployeesOptions = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 1,
      search: req.query.search as string,
      minHourRate: req.query.minHourRate ? Number(req.query.minHourRate) : undefined,
      maxHourRate: req.query.maxHourRate ? Number(req.query.maxHourRate) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      address: req.query.address as string || "",
      radius: req.query.radius ? Number(req.query.radius) : undefined,
      jobCategory : req.query.jobCategory  as string || ""
    };

    console.log("data to be queried : ",queryData)

    const employeeData  = await getAllEmployeeForCustomer(queryData);
    console.log("this is data : ",employeeData)
    if(!employeeData){
      throw new Error();
    }
    res.status(201).json({employeeRecords :  employeeData, success : true,})
  } catch (error) {
    res.status(500).json({ message: "failed to get employeee", success: false })
  }
}