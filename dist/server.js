"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./Database/Database");
const MainApp_1 = require("./MainApp");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = 5032;
const app = (0, express_1.default)();
(0, MainApp_1.MainApp)(app);
app.set("view engine", "ejs");
app.set("Views", path_1.default.join(__dirname, "Views"));
const server = app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
});
process.on("uncaughtException", (error) => {
    console.log("stop here:uncaughtexceptionerror");
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log(`an unhhandleld rejection error has occured ${reason}`);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=server.js.map