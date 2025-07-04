import { Response, Request } from "express";
import { Appointment } from "../../models/employee-appointment.model";
import axios from "axios";
import { Payment } from "../../models/payment.model";
import { generateEsewaSignature } from "../../lib/helper/generate-payment-hash";

export const initiateEsewaPayment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;


    // Validate input
    if (!appointmentId) {
       res.status(400).json({
        error: "Appointment ID is required",
        success: false,
      });
      return
    }

    // Fetch appointment data
    const appointment = await Appointment.findById({_id : appointmentId});
    if (!appointment) {
       res.status(404).json({
        error: "Appointment not found",
        success: false,
      });
      return
    }

    // Validate environment variables
    const requiredEnvVars = [
      "ESEWA_MERCHANT_CODE",
      "ESEWA_SECRET_KEY",
      "ESEWA_PAYMENT_URL",
      "SUCCESS_URL",
      "FAILURE_URL"
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`${envVar} is not configured`);
      }
    }

    // Prepare payment data
    const amount = appointment.companyCommissionPrice.toString();
    const paymentData = {
      amount,
      tax_amount: "0",
      product_service_charge: "0",
      product_delivery_charge: "0",
      total_amount: amount, // In your case, total = amount since others are 0
      transaction_uuid: appointmentId,
      product_code: process.env.ESEWA_MERCHANT_CODE!,
      success_url: process.env.SUCCESS_URL!,
      failure_url: process.env.FAILURE_URL!,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Generate signature
    const signature = generateEsewaSignature(
      paymentData.total_amount,
      paymentData.transaction_uuid,
      paymentData.product_code,
      process.env.ESEWA_SECRET_KEY!
    );

    // Make payment request to eSewa
    const response = await axios.post(process.env.ESEWA_PAYMENT_URL!, null, {
      params: {
        ...paymentData,
        signature
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // Get redirect URL from response
    const paymentUrl = response.request?.res?.responseUrl;
    if (!paymentUrl) {
      throw new Error("No payment URL received from eSewa");
    }

    // Create payment record
    const paymentRecord = await Payment.create({
      employeeId: appointment.employeeId,
      appointmentId: appointment._id,
      amount: appointment.companyCommissionPrice,
      paymentMethod: "esewa",
      status: "PENDING",
      transactionUuid: appointmentId,
    });

     res.status(200).json({
      url: paymentUrl,
      success: true,
      paymentId: paymentRecord._id,
    });

  } catch (error) {
    console.error("Payment initiation error:", error);
    

    res.status(401).json({
      message: "failed to do ",
      success: false,
    });
  }
};
export const verifyEsewaPayment = async (req: Request, res: Response) => {
  console.log("i am being called for verificiton : ")
  try {
    const { appointmentId, transaction_code, signature } = req.body;
    
    if (!appointmentId || !transaction_code || !signature) {
      res.status(400).json({
        error: "Transaction ID, code and signature are required",
        success: false,
      });
      return;
    }
    
    
    console.log("this ish te reuq body : ",req.body)

    const payment = await Payment.findOne({ appointmentId});
    if (!payment) {
       res.status(404).json({
        error: "Payment record not found",
        success: false,
      });
      return;
    }

  
    const statusResponse = await axios.get(
      `${process.env.ESEWA_PAYMENT_STATUS_CHECK_URL}`,
      {
        params: {
          product_code: process.env.ESEWA_MERCHANT_CODE!,
          total_amount: payment.amount,
          transaction_uuid: payment.appointmentId,
        }
      }
    );


    payment.status = statusResponse.data.status === "COMPLETE" ? "COMPLETED" : payment.status;
    payment.transactionCode = transaction_code;
    await payment.save();

    await Appointment.findByIdAndUpdate({_id : appointmentId},{
      $set : {requestStatus : "accepted", commissionStatus : true}
    });

    res.status(200).json({
      status: payment.status,
      referenceId: payment.referenceId,
      paidAmount : payment.amount,
      appointmentId ,
      success: true,

    });

  } catch (error) {
    console.error("Payment verification error:", error);
    await Payment.updateOne(
      {
        appointmendId : req.body.appointmendId
      },
      {
        $set : {status : "FAILED"}
      }
    )
    res.status(500).json({
      message: "Failed to verify payment",
      success: false,
    });
  }
};