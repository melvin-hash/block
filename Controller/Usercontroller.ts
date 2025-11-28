import UserModel from "../Model/UserModel";
import ProfileModel from "../Model/Profilemodel";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_PASSWORD,
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "variationofeventsisatrandom";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { FullName, Email, UserName, Password, PhoneNumber } = req.body;
    if (!FullName || !UserName || !Email || !Password || !PhoneNumber) {
      return res.status(401).json({
        message: "All fields required",
      });
    }
    const CheckEmail = await UserModel.findOne({ Email: Email });
    if (CheckEmail) {
      return res.status(401).json({
        message: "Email Already in use",
      });
    }
    if (Password.length < 8) {
      return res.status(401).json({
        message: "password must not be less than eight characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(Password, salt);
    const UserData = await UserModel.create({
      FullName: FullName,
      UserName: UserName,
      Email: Email,
      Password: HashedPassword,
      PhoneNumber: PhoneNumber,
    });
    const CreateProfile = await ProfileModel.create({
      _id: UserData._id,
      FullName: `${FullName} ${UserName}`,
      Gender: "",
      Address: "",
      Avatar: "",
    });
    
    UserData.Profile = CreateProfile._id as mongoose.Types.ObjectId;
    await UserData.save();

    let mailOption = {
      from: process.env.BREVO_EMAIL,
      to: Email,
      subject: "Melasi Stores - Verify Your Account",
      html: `<b>PLEASE CLICK ON THE LINK <a href="faint-lily-melasicodelab-31cb4284.koyeb.app/api/v1/verify-account/${UserData._id}">VERIFY ACCOUNT</a> TO VERIFY YOUR ACCOUNT</b>`,
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("✅ Email sent successfully");
    } catch (emailError: any) {
      console.error("❌ Email sending failed:", emailError.message);
    }

    return res.status(200).json({
      message: "registration was successful check email to verify account",
      success: 1,
      Result: UserData,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "unable to create user",
      Reason: error.message,
    });
  }
};

export const LoginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const checkEmail = await UserModel.findOne({ Email: email }).lean();

    if (checkEmail) {
      const CheckPassword = await bcrypt.compare(password, checkEmail.Password);

      if (CheckPassword) {
        if (checkEmail.Verify) {
          const token = jwt.sign(
            {
              _id: checkEmail?._id,
              UserName: checkEmail.UserName,
            },
            JWT_SECRET,
            { expiresIn: "40m" }
          );
          res.cookie("sessionId", token);

          return res.status(201).json({
            success: 1,
            message: "login successful",
            data: token,
          });
        } else {
          let mailOption = {
            from: process.env.BREVO_EMAIL,
            to: email,
            subject: "Melasi Stores - Verify Your Account",
            html: `<b>PLEASE CLICK ON THE LINK <a href="faint-lily-melasicodelab-31cb4284.koyeb.app/api/v1/Verify-Account/${checkEmail._id}">VERIFY ACCOUNT</a> TO VERIFY YOUR ACCOUNT</b>`,
          };
          try {
            await transporter.sendMail(mailOption);
            console.log("✅ Verification email sent");
          } catch (emailError: any) {
            console.error("❌ Verification email failed:", emailError.message);
          }

          return res.status(404).json({
            message: "please check your email to verify account",
          });
        }
      } else {
        return res.status(404).json({
          message: "Password is incorrect",
        });
      }
    } else {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: `unable to login because ${error}`,
    });
  }
};

export const GetAvailableBalance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const userData = await UserModel.findById(user._id);

    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: 1,
      message: "Balance retrieved successfully",
      data: {
        userId: userData._id,
        userName: userData.UserName,
        availableBalance: userData.AvailableBalance || 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Unable to get available balance for this user",
      error: error.message,
    });
  }
};

export const GetCurrentPlan = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const userData = await UserModel.findById(user._id);

    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: 1,
      message: "Current plan retrieved successfully",
      data: {
        userId: userData._id,
        userName: userData.UserName,
        currentPlan: userData.InvestmentPlan || "No plan assigned",
        email: userData.Email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Unable to get current plan for this user",
      error: error.message,
    });
  }
};

export const UpdateInvestmentPlan = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const { investmentPlan } = req.body;

    if (!investmentPlan) {
      return res.status(400).json({
        message: "Investment plan is required.",
      });
    }

    const validPlans = ["Beginners Plan", "Professional Plan", "Promo plan", "Master Plan"];
    if (!validPlans.includes(investmentPlan)) {
      return res.status(400).json({
        message: "Invalid investment plan.",
        validPlans: validPlans,
      });
    }

    const userData = await UserModel.findById(user._id);

    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    userData.InvestmentPlan = investmentPlan;
    await userData.save();

    return res.status(200).json({
      success: 1,
      message: "Investment plan updated successfully",
      data: {
        userId: userData._id,
        userName: userData.UserName,
        investmentPlan: userData.InvestmentPlan,
        availableBalance: userData.AvailableBalance,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Unable to update investment plan for this user",
      error: error.message,
    });
  }
};

export const UpdateAvailableBalance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const { amount } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        message: "Amount is required.",
      });
    }

    if (typeof amount !== "number" || amount < 0) {
      return res.status(400).json({
        message: "Amount must be a positive number.",
      });
    }

    const userData = await UserModel.findById(user._id);

    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const previousBalance = userData.AvailableBalance || 0;
    const newBalance = previousBalance + amount;

    userData.AvailableBalance = newBalance;
    await userData.save();

    return res.status(200).json({
      success: 1,
      message: "Balance added successfully",
      data: {
        userId: userData._id,
        userName: userData.UserName,
        previousBalance: previousBalance,
        amountAdded: amount,
        newBalance: newBalance,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Unable to update balance for this user",
      error: error.message,
    });
  }
};

export const SubtractAvailableBalance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const { amount } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        message: "Amount is required.",
      });
    }

    if (typeof amount !== "number" || amount < 0) {
      return res.status(400).json({
        message: "Amount must be a positive number.",
      });
    }

    const userData = await UserModel.findById(user._id);

    if (!userData) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const currentBalance = userData.AvailableBalance || 0;

    if (currentBalance < amount) {
      return res.status(400).json({
        success: 0,
        message: "You don't have enough balance to complete the transaction.",
        data: {
          currentBalance: currentBalance,
          requestedAmount: amount,
          shortfall: amount - currentBalance,
        },
      });
    }

    const newBalance = currentBalance - amount;

    userData.AvailableBalance = newBalance;
    await userData.save();

    return res.status(200).json({
      success: 1,
      message: "Balance subtracted successfully",
      data: {
        previousBalance: currentBalance,
        amountSubtracted: amount,
        newBalance: newBalance,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Unable to subtract balance for this user",
      error: error.message,
    });
  }
};