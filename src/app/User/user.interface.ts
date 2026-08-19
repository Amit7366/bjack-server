import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';
/* eslint-disable no-unused-vars */
export type TUser = {
  _id: any;
  id?: string;
  userName?: string;
  customerOfficerId?: string | null;
  engagementStatus?: 'booked' | 'free' | 'blocked';

  contactNo: string;
  referralId?: string;
  referredBy?: string;
  refferCount?: number;
  email?: string;
  password: string;
  country?: string[];
  device?: string;
  gender?: {
    type: string;
    enum: ['male', 'female', 'other'];
  };
  userLevel?: {
    type: string;
    enum: ['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'];
    default: 'Normal';
  };
  age?: {
    type: number;
  };
  otpCode?: string;
  otpExpiresAt?: Date;
  otpVerified?: boolean;
  
  lastActiveAt?: Date;
  userPlainPassword?: string;

  needsPasswordChange?: boolean;
  passwordChangeAt?: Date;
  role: 'superAdmin' | 'admin' | 'viewer' | 'user' | 'advertiser';
  dateOfBirth?: Date;
  status?: 'active' | 'frozen' | 'deactivated' | 'pending';
  signupBonusGiven?: boolean;
  // ✅ KYC
  kycVerified?: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected' | null;
  kycDocumentType?: string;
  kycDocumentNo?: string;
  kycDocumentExpiry?: Date;
  kycDocumentFrontUrl?: string;
  kycDocumentBackUrl?: string;
  kycSelfieUrl?: string;
  kycSubmittedAt?: Date;
  kycReviewedAt?: Date;
  kycReviewNote?: string;

  isVerified: boolean;
  isDeleted: boolean;


};
// export interface UserModel extends Model<TUser> {
//   // myStaticMethod(): number
//   isUserExistsByUserName(username: string): Promise<TUser>;
//   isPasswordMatched(
//     plainTextPassword: string,
//     hashedPassword: string,
//   ): Promise<boolean>;
// }
// export type TUserRole = keyof typeof USER_ROLE;
export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isUserExistsByEmail(email: string): Promise<TUser>;
  isUserExistsByUserName(userName: string): Promise<TUser>;
  isUserExistsByContactNo(contactNo: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
