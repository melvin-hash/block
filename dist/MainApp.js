"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = __importDefault(require("./Router/UserRouter"));
const MainApp = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.get("/api/v1", (req, res) => {
        res.status(200).json({
            message: "Api is running successfully",
        });
    });
    app.use("/api/v1", UserRouter_1.default);
};
exports.MainApp = MainApp;
//# sourceMappingURL=MainApp.js.map