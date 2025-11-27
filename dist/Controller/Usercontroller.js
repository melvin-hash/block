"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = exports.CreateUser = void 0;
const UserModel_1 = __importDefault(require("../Model/UserModel"));
const Profilemodel_1 = __importDefault(require("../Model/Profilemodel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "emmanulmelv@gmail.com",
        pass: "lvlq vsja tjro fmrc",
    },
});
const CreateUser = async (req, res) => {
    try {
        const { FulllName, Email, UserName, Password, PhoneNumber } = req.body;
        if (!FulllName || !UserName || !Email || !Password || !PhoneNumber) {
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
            FulllName: FulllName,
            UserName: UserName,
            Email: Email,
            Password: HashedPassword,
        });
        const CreateProfile = await Profilemodel_1.default.create({
            _id: UserData._id,
            FullName: `${FulllName} ${UserName}`,
            Gender: "",
            Address: "",
            Avatar: "",
        });
        UserData.Profile = CreateProfile._id;
        await UserData.save();
        let mailOption = {
            from: '"Melasi Stores 🤳📱📺" <noreply@MelasiStores.com>', // sender address
            to: Email, // list of receivers
            subject: "Melasi Stores", // Subject line
            html: `<b>PLEASE CLICK ON THE LINK <a href="faint-lily-melasicodelab-31cb4284.koyeb.app/api/v1/verify-account/${UserData._id}">link</a>TO VERIFY YOUR ACCOUNT</b>`, // html body
        };
        await transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("eror sending mail", error);
            }
            else {
                console.log("email send", info.response);
            }
        });
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
                    }, "variationofeventsisatrandom", { expiresIn: "40m" });
                    //  console.log("Melasi", token);
                    // const { password, ...info } = checkEmail._doc;
                    res.cookie("sessionId", token);
                    console.log(req.headers["cookie"]);
                    return res.status(201).json({
                        success: 1,
                        message: "login successful",
                        data: token,
                    });
                }
                else {
                    let mailOption = {
                        from: '"Melasi Stores 📱🤳" "<Noreply@melasistores.com>"', // sender address
                        to: email, // list of receivers
                        subject: "Melasi stores", // Subject line
                        html: `<b>PLEASE CLICK ON THE LINK <a href="faint-lily-melasicodelab-31cb4284.koyeb.app/api/v1/Verify-Account/${checkEmail._id}"/>Link</a>TO VERIFY YOUR ACCOUNT</b>`, // html body
                    };
                    await transporter.sendMail(mailOption, (error, info) => {
                        if (error) {
                            console.log("eeror sending mail", error);
                        }
                        else {
                            console.log("email send", info.response);
                        }
                    });
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
//# sourceMappingURL=Usercontroller.js.map