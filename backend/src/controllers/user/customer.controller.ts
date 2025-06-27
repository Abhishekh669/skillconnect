import { Request, Response } from "express";
import { GetEmployeesOptions } from "../../lib/types/employee-query";
import { getAllEmployeeForCustomer } from "../../services/user/user.customer.service";
import { EmployeeProfile } from "../../models/employee-profile.model";
import { Appointment } from "../../models/employee-appointment.model";

export const getAllEmployeeForCustomerHandler = async (req: Request, res: Response) => {
  try {
    console.log("qeury in rquest :", req.query)
    const queryData: GetEmployeesOptions = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 1,
      search: req.query.search as string,
      minHourRate: req.query.minHourRate ? Number(req.query.minHourRate) : undefined,
      maxHourRate: req.query.maxHourRate ? Number(req.query.maxHourRate) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      address: req.query.address as string || "",
      radius: req.query.radius ? Number(req.query.radius) : undefined,
      jobCategory: req.query.jobCategory as string || ""
    };

    console.log("data to be queried : ", queryData)

    const employeeData = await getAllEmployeeForCustomer(queryData);
    console.log("this is data : ", employeeData)
    if (!employeeData) {
      throw new Error();
    }
    res.status(200).json({ employeeRecords: employeeData, success: true, })
  } catch (error) {
    res.status(500).json({ message: "failed to get employeee", success: false })
  }

}


export const getEmployeeFromIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ message: "failed to get employee", success: false })
      return;
    }
    const employeeData = await EmployeeProfile.findOne({ _id: userId });
    if (!employeeData) {
      res.status(404).json({ message: "failed to get employee", success: false })
      return;
    }
    res.status(200).json({ employeeData, success: true, })
  } catch (error) {
    res.status(500).json({ message: "failed to get employee", success: false })

  }
}



export const getEmployeeAppointmentForCustomer = async (req: Request, res: Response) => {
  try {
    const profileId = req.params.profileId;
    if (!profileId) {
      res.status(400).json({ message: "failed to get employee profile id", success: false })
      return;
    }

    const [topEmployeeAppointments, countResult] = await Promise.all([
      Appointment.find({
        employeeProfileId: profileId,
        requestStatus: "not-responded"
      })
        .select("_id customerId employeeProfileId offeredPrice timeRequired deadline requestStatus createdAt")
        .sort({ offeredPrice: -1 })
        .limit(5)
        .lean()
        .exec(),

      Appointment.countDocuments({
        employeeProfileId: profileId,
        requestStatus: "not-responded"
      }).exec()
    ]);
    console.log("this is data of appointment : ",topEmployeeAppointments, " count : ", countResult)
    res.status(200).json({ appointmentData : {
      appointments : topEmployeeAppointments,
      totalAppointment : countResult
    },success: true})

  } catch (error) {
    res.status(500).json({ message: "failed to get employee appointment", success: false })

  }
} 
