"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Usercontroller_1 = require("../Controller/Usercontroller");
const router = express_1.default.Router();
router.route("/Create-User").post(Usercontroller_1.CreateUser);
router.route("/Login-user").post(Usercontroller_1.LoginUser);
//# sourceMappingURL=UserRouter.js.map