"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Usercontroller_1 = require("../Controller/Usercontroller");
const verify_1 = require("../Middleware/verify");
const router = express_1.default.Router();
router.route("/Create-User").post(Usercontroller_1.CreateUser);
router.route("/Login-user").post(Usercontroller_1.LoginUser);
router.route("/Get-Balance").get(verify_1.verifyToken, Usercontroller_1.GetAvailableBalance);
router.route("/Get-Current-Plan").get(verify_1.verifyToken, Usercontroller_1.GetCurrentPlan);
router.route("/Update-Plan").put(verify_1.verifyToken, Usercontroller_1.UpdateInvestmentPlan);
router.route("/Add-Balance").put(verify_1.verifyToken, Usercontroller_1.UpdateAvailableBalance);
router.route("/Subtract-Balance").put(verify_1.verifyToken, Usercontroller_1.SubtractAvailableBalance);
exports.default = router;
//# sourceMappingURL=UserRouter.js.map