import mongoose from "mongoose";
interface profile {
    FullName: string;
    Gender: string;
    Address: string;
    Avatar: string;
}
interface Iprofile extends profile, mongoose.Document {
}
declare const _default: mongoose.Model<Iprofile, {}, {}, {}, mongoose.Document<unknown, {}, Iprofile, {}, mongoose.DefaultSchemaOptions> & Iprofile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, Iprofile>;
export default _default;
//# sourceMappingURL=Profilemodel.d.ts.map