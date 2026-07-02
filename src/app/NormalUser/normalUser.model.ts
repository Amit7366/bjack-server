import { Schema, model } from 'mongoose';
import { NormalUserModel, TNormalUser } from './normalUser.interface';
import { BloodGroup, Gender } from './normalUser.constant'; // Ensure these constants are defined appropriately

// Define the NormalUser schema
const NormalUserSchema = new Schema<TNormalUser, NormalUserModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
    },
    ip: {
      type: String,
      // unique: true,
      // sparse: true,
    },
    device: {
      type: String,
      // required: [true, 'Device signature is required'], 
      // unique: true,
    },
    deviceFingerprint: {
      type: String,
      // unique: true, // Ensure it's unique across users
      // sparse: true, // Allow null values for legacy users
    },
    knownDeviceFingerprints: {
      type: [String],
      default: [],
    },

    country: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    userName: {
      type: String,
      required: [true, 'userName is required'],
      unique: true,
    },
    customerOfficerId: { type: String, default: null },

    engagementStatus: {
      type: String,
      enum: ['booked', 'free', 'blocked'],
      default: 'free',
    },

    contactNo: {
      type: String,
      required: [true, 'Contact is required'],
      unique: true,
    },
    age: {
      type: Number,
      required: [false, 'Age is required'],
    },

    referralId: { type: String, unique: true },
    referredBy: { type: String, default: null },
    _referrerUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    refferCount: {
      type: Number,
      default: 0,
    },
    userLevel: {
      type: String,
      enum: ['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Normal',
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(Gender), // Use Object.values for enum values
        message: '{VALUE} is not a valid gender',
      },
      required: [false, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    status: {
      type: String,
      enum: ['active', 'frozen', 'deactivated', 'pending'],
      default: 'active',
    },

    signupBonusGiven: {
      type: Boolean,
      default: false,
    },
    // ✅ KYC
    
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
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    userPlainPassword: {
      type: String,
      required: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      // required: [true, 'Email is required'],
      // unique: true,
    },
    emergencyContactNo: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: Object.values(BloodGroup), // Use Object.values for enum values
        message: '{VALUE} is not a valid blood group',
      },
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    presentAddress: {
      type: String,
      required: [false, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
    },
    profileImg: { type: String, default: '' },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// Filter out deleted documents
NormalUserSchema.index({ knownDeviceFingerprints: 1 });

NormalUserSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NormalUserSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NormalUserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Static methods to check if user exists
NormalUserSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await this.findOne({ id });
  return existingUser;
};

NormalUserSchema.statics.isIPExists = async function (ip: string) {
  const existingUser = await this.findOne({ ip });
  return existingUser;
};
// NormalUserSchema.statics.isDeviceExists = async function (device: string) {
//   return await this.findOne({ device });
// };




// Export the model
export const NormalUser = model<TNormalUser, NormalUserModel>('NormalUser', NormalUserSchema);
