import { TPartnerType } from './advertiser.interface';

export const PartnerType: TPartnerType[] = ['affiliate', 'advertiser'];

export const AdvertiserSearchableFields = [
  'email',
  'id',
  'contactNo',
  'userName',
  'name.firstName',
  'name.lastName',
  'partnerType',
];
