import express from "express"
import { CreateUser,LoginUser } from "../Controller/Usercontroller"
const router = express.Router()
router.route("/Create-User").post(CreateUser)
router.route("/Login-user").post(LoginUser)