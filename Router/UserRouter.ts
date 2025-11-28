import express from "express";
import { 
  CreateUser, 
  LoginUser,
  GetAvailableBalance,
  GetCurrentPlan,
  UpdateInvestmentPlan,
  UpdateAvailableBalance,
  SubtractAvailableBalance
} from "../Controller/Usercontroller";
import { verifyToken } from "../Middleware/verify";

const router = express.Router();

router.route("/Create-User").post(CreateUser);
router.route("/Login-user").post(LoginUser);
router.route("/Get-Balance").get(verifyToken, GetAvailableBalance);
router.route("/Get-Current-Plan").get(verifyToken, GetCurrentPlan);
router.route("/Update-Plan").put(verifyToken, UpdateInvestmentPlan);
router.route("/Add-Balance").put(verifyToken, UpdateAvailableBalance);
router.route("/Subtract-Balance").put(verifyToken, SubtractAvailableBalance);

export default router;