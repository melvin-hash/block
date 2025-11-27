"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    const getSession = req.headers["cookie"];
    if (!getSession) {
        return res.status(404).json({
            message: "please login to get token",
        });
    }
    const tokenCookies = await getSession.split("=")[1];
    // console.log("melvin", tokenCookies);
    if (tokenCookies) {
        const tokens = await tokenCookies;
        jsonwebtoken_1.default.verify(tokens, "variationofeventsisatrandom", (err, payload) => {
            if (err) {
                return res.status(404).json({ message: "token expire" });
            }
            req.user = payload;
            next();
        });
    }
    else {
        return res.status(404).json({
            message: "please provide a valid token",
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verify.js.map