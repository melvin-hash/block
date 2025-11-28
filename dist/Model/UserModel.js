"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    FullName: {
        type: String,
    },
    UserName: {
        type: String,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
    },
    PhoneNumber: {
        type: String,
    },
    AvailableBalance: {
        type: Number,
        default: 0,
    },
    InvestmentPlan: {
        type: String,
        enum: ["Beginners Plan", "Professional Plan", "Promo plan", "Master Plan"],
        default: "Beginners Plan",
    },
    Verify: {
        type: Boolean,
        default: false,
    },
    Profile: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "profile",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("user", UserSchema);
//# sourceMappingURL=UserModel.js.map