import mongoose from "mongoose";
interface user {
    FullName: string;
    UserName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    AvailableBalance: number;
    InvestmentPlan: "Beginners Plan" | "Professional Plan" | "Promo plan" | "Master Plan";
    Verify: boolean;
    Profile: mongoose.Types.ObjectId;
    createdAt: Date;
}
interface Iuser extends user, mongoose.Document {
}
declare const _default: mongoose.Model<Iuser, {}, {}, {}, mongoose.Document<unknown, {}, Iuser, {}, mongoose.DefaultSchemaOptions> & Iuser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, Iuser>;
export default _default;
//# sourceMappingURL=UserModel.d.ts.map