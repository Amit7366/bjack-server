import { Model, Types } from 'mongoose';

export type TPartnerType = 'affiliate' | 'advertiser';

export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TAdvertiser = {
  _id: Types.ObjectId;
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  userName: string;
  email: string;
  contactNo: string;
  partnerType: TPartnerType;
  isDeleted: boolean;
};

export interface AdvertiserModel extends Model<TAdvertiser> {
  isUserExists(id: string): Promise<TAdvertiser | null>;
}
