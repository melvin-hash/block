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

interface Iuser extends user, mongoose.Document { }
const UserSchema = new mongoose.Schema(
    {
        FullName: {
            type: String
        },
        UserName: {
            type: String
        },
        Email: {
            type: String
        },
        Password: {
            type:String
        },
        Profile: {
            type: mongoose.Types.ObjectId,
            ref:"profile"
        },
        PhoneNumber:{
            type:Number
        },
        Verify: {
            type: Boolean,
            default:false
        },
       
    })
export default mongoose.model<Iuser>("user",UserSchema)