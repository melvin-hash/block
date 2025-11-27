import mongoose from "mongoose";
interface user {
    FulllName: string;
    UserName: string;
    Email: string;
    Password: string;
    PhoneNumber: number;
    Profile?: mongoose.Types.ObjectId;
    Verify: boolean;
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