"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtractAvailableBalance = exports.UpdateAvailableBalance = exports.UpdateInvestmentPlan = exports.GetCurrentPlan = exports.GetAvailableBalance = exports.LoginUser = exports.CreateUser = void 0;
const UserModel_1 = __importDefault(require("../Model/UserModel"));
const Profilemodel_1 = __importDefault(require("../Model/Profilemodel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_PASSWORD,
    },
});
const JWT_SECRET = process.env.JWT_SECRET || "variationofeventsisatrandom";
const CreateUser = async (req, res) => {
    try {
        const { FullName, Email, UserName, Password, PhoneNumber } = req.body;
        if (!FullName || !UserName || !Email || !Password || !PhoneNumber) {
            return res.status(401).json({
                message: "All fields required",
            });
        }
        const CheckEmail = await UserModel_1.default.findOne({ Email: Email });
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
        const salt = await bcryptjs_1.default.genSalt(10);
        const HashedPassword = await bcryptjs_1.default.hash(Password, salt);
        const UserData = await UserModel_1.default.create({
            FullName: FullName,
            UserName: UserName,
            Email: Email,
            Password: HashedPassword,
            PhoneNumber: PhoneNumber,
        });
        const CreateProfile = await Profilemodel_1.default.create({
            _id: UserData._id,
            FullName: `${FullName} ${UserName}`,
            Gender: "",
            Address: "",
            Avatar: "",
        });
        UserData.Profile = CreateProfile._id;
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
        }
        catch (emailError) {
            console.error("❌ Email sending failed:", emailError.message);
        }
        return res.status(200).json({
            message: "registration was successful check email to verify account",
            success: 1,
            Result: UserData,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "unable to create user",
            Reason: error.message,
        });
    }
};
exports.CreateUser = CreateUser;
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkEmail = await UserModel_1.default.findOne({ Email: email }).lean();
        if (checkEmail) {
            const CheckPassword = await bcryptjs_1.default.compare(password, checkEmail.Password);
            if (CheckPassword) {
                if (checkEmail.Verify) {
                    const token = jsonwebtoken_1.default.sign({
                        _id: checkEmail?._id,
                        UserName: checkEmail.UserName,
                    }, JWT_SECRET, { expiresIn: "40m" });
                    res.cookie("sessionId", token);
                    return res.status(201).json({
                        success: 1,
                        message: "login successful",
                        data: token,
                    });
                }
                else {
                    let mailOption = {
                        from: process.env.BREVO_EMAIL,
                        to: email,
                        subject: "Melasi Stores - Verify Your Account",
                        html: `<b>PLEASE CLICK ON THE LINK <a href="faint-lily-melasicodelab-31cb4284.koyeb.app/api/v1/Verify-Account/${checkEmail._id}">VERIFY ACCOUNT</a> TO VERIFY YOUR ACCOUNT</b>`,
                    };
                    try {
                        await transporter.sendMail(mailOption);
                        console.log("✅ Verification email sent");
                    }
                    catch (emailError) {
                        console.error("❌ Verification email failed:", emailError.message);
                    }
                    return res.status(404).json({
                        message: "please check your email to verify account",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "Password is incorrect",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: `unable to login because ${error}`,
        });
    }
};
exports.LoginUser = LoginUser;
const GetAvailableBalance = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({
                message: "User not authenticated.",
            });
        }
        const userData = await UserModel_1.default.findById(user._id);
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Unable to get available balance for this user",
            error: error.message,
        });
    }
};
exports.GetAvailableBalance = GetAvailableBalance;
const GetCurrentPlan = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({
                message: "User not authenticated.",
            });
        }
        const userData = await UserModel_1.default.findById(user._id);
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Unable to get current plan for this user",
            error: error.message,
        });
    }
};
exports.GetCurrentPlan = GetCurrentPlan;
const UpdateInvestmentPlan = async (req, res) => {
    try {
        const user = req.user;
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
        const userData = await UserModel_1.default.findById(user._id);
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Unable to update investment plan for this user",
            error: error.message,
        });
    }
};
exports.UpdateInvestmentPlan = UpdateInvestmentPlan;
const UpdateAvailableBalance = async (req, res) => {
    try {
        const user = req.user;
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
        const userData = await UserModel_1.default.findById(user._id);
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Unable to update balance for this user",
            error: error.message,
        });
    }
};
exports.UpdateAvailableBalance = UpdateAvailableBalance;
const SubtractAvailableBalance = async (req, res) => {
    try {
        const user = req.user;
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
        const userData = await UserModel_1.default.findById(user._id);
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Unable to subtract balance for this user",
            error: error.message,
        });
    }
};
exports.SubtractAvailableBalance = SubtractAvailableBalance;
//# sourceMappingURL=Usercontroller.js.map