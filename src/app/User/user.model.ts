import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      unique: true,
    },
    device: {
      type: String,
      // required: [true, 'Device is required'],
      // unique: true, // Ensure one account per device
    },


    userName: { type: String, unique: true },
    customerOfficerId: { type: String, default: null },

    engagementStatus: {
      type: String,
      enum: ['booked', 'free', 'blocked'],
      default: 'free',
    },

    contactNo: {
      type: String,
      unique: true
    },
    referralId: { type: String, unique: true },
    referredBy: { type: String, default: null },
    refferCount: {
      type: Number,
      default: 0,
    },
    email: { type: String },
    userLevel: {
      type: String,
      enum: ['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Normal',
    },
    userPlainPassword: {
      type: String,
      required: false,
    },
    password: { type: String, required: true, select: false },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'user', 'advertiser'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'deactivated', 'pending'],
      default: 'active',
    },
    signupBonusGiven: {
      type: Boolean,
      default: false,
    },

    kycVerified: { type: Boolean, default: false },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: null,
    },
    kycDocumentType: { type: String, required: false },
    kycDocumentNo: { type: String, required: false },
    kycDocumentExpiry: { type: Date, required: false },
    kycDocumentFrontUrl: { type: String, required: false },
    kycDocumentBackUrl: { type: String },
    kycSelfieUrl: { type: String, required: false },
    kycSubmittedAt: { type: Date, required: false },
    kycReviewedAt: { type: Date, required: false },
    kycReviewNote: { type: String, required: false },

    dateOfBirth: { type: Date },
    lastActiveAt: { type: Date, default: Date.now },

    country: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    age: {
      type: Number,
    },
    // OTP for Forgot Password
    otpCode: {
      type: String,
      required: false,
    },

    otpExpiresAt: {
      type: Date,
      required: false,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this as any;

  // Only hash if password modified
  if (!user.isModified('password')) {
    return next();
  }

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round) || 10,
  );

  next();
});



userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  console.log(`Querying user by custom ID: ${id}`);
  const user = await this.findOne({ id }).select('+password');
  console.log('Result:', user);
  return user;
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  console.log(`Querying user by email: ${email}`);
  const user = await this.findOne({ email }).select('+password');
  console.log('Result:', user);
  return user;
};
userSchema.statics.isUserExistsByUserName = async function (userName: string) {
  console.log(`Querying user by userName: ${userName}`);
  const user = await this.findOne({ userName }).select('+password');
  console.log('Result:', user);
  return user;
};
userSchema.statics.isUserExistsByContactNo = async function (contactNo: string) {
  console.log(`Querying user by contactNo: ${contactNo}`);
  const user = await this.findOne({ contactNo }).select('+password');
  console.log('Result:', user);
  return user;
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};
export const User = model<TUser, UserModel>('User', userSchema);
