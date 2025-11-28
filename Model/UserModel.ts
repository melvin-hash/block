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

interface Iuser extends user, mongoose.Document {}

const UserSchema = new mongoose.Schema<Iuser>({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<Iuser>("user", UserSchema);