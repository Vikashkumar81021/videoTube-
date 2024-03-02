import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trime: true,
      indedx: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trime: true,
    },
    fullname: {
      type: String,
      required: true,
      trime: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudnary url
      required: true,
    },
    coveredImage: {
      type: String, //cloudnary url
      required: true,
    },
    watchHistory: [
      {
        type: String,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.comparePassword =async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    userName:this.userName
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
   expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}

userSchema.methods.generateRefereshToken=function(){
  return jwt.sign({
    _id:this,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env. REFRESH_TOKEN_EXPIRY
  }
  )
}

export const User = mongoose.model("User", userSchema);
