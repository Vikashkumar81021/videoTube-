import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/user-model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullname, email, password } = req.body;
  if ([userName, fullname, email, password].some((field) => 
  field?.trim()=== "")) 
  {
    throw new ApiError(404,"All fields are required")
  }
  const userExist= await User.findOne({
    $or:({userName},{email})
  })
  if(userExist){
    throw new ApiError(409,"User with email or password already exists")
  }
  const avatarLocalPath=req.files?.avatar[0]?.path;
  
  const coverdImageLocalPath=req.files?. coveredImage[0]?.path;
  if(!avatarLocalPath){
    throw new ApiError(400,"Avtar file is required")
  }

  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverdImageLocalPath)
  if(!avatar){
    throw new ApiError(400,"Avtar file are Required")
  }
 const user=await User.create({
    fullname,
    avatar:avatar.url,
    coveredImage: coverImage?.url || "",
    userName:userName.toLowerCase(),
    email,
    password
  })
  const createUser=await User.findById(user._id).select(
    "password -  refreshToken"
  )
  if(!createUser){
    throw new ApiError(500,"Something went Wrong registring the user")
  }
  return res.status(201).json(
    new ApiResponse(200,createUser,"User register successfully")
  )
});

const loginUser=asyncHandler(async(req,res)=>{
  const {userName,email,password}=req.body
  if(!userName || !email ){
    throw new ApiError(400,"Username or password is required")
  }
  const user=await User.findOne({
    $or:[{userName},{password}]
  })
  if(!user){
    throw new ApiError(404,"User does not exists")
  }
  const comparePassword=await user.comparePassword(password)
  if(!comparePassword){
    throw new ApiError(401,"invalid user credentails")
  }
})

export { 
  registerUser ,
  loginUser
};
