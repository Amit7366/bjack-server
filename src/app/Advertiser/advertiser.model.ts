import { Schema, model } from 'mongoose';
import { PartnerType } from './advertiser.constant';
import { AdvertiserModel, TAdvertiser, TUserName } from './advertiser.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const advertiserSchema = new Schema<TAdvertiser, AdvertiserModel>(
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
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    userName: {
      type: String,
      required: [true, 'UserName is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    partnerType: {
      type: String,
      enum: {
        values: PartnerType,
        message: '{VALUE} is not a valid partner type',
      },
      required: [true, 'Partner type is required'],
    },
    commissionRate: {
      type: Number,
      default: null,
      min: 0,
      max: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

advertiserSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName || ''} ${this?.name?.lastName || ''}`;
});

advertiserSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

advertiserSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

advertiserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

advertiserSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Advertiser.findOne({ id });
  return existingUser;
};

export const Advertiser = model<TAdvertiser, AdvertiserModel>(
  'Advertiser',
  advertiserSchema,
);
