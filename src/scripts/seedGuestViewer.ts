import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Admin } from '../app/Admin/admin.model';
import { USER_ROLE } from '../app/User/user.constant';
import { User } from '../app/User/user.model';
import { generateAdminId } from '../app/User/user.utils';
import { connectSeedDb } from './seedUtils';

dotenv.config();

export const GUEST_VIEWER = {
  userName: 'guestadmin',
  password: 'GuestView@2026',
  email: 'guestadmin@rajabaji.local',
  contactNo: '+8801999000111',
};

async function main() {
  await connectSeedDb();

  let user = await User.findOne({ userName: GUEST_VIEWER.userName });
  let created = false;

  if (user) {
    user.role = USER_ROLE.viewer;
    user.email = GUEST_VIEWER.email;
    user.contactNo = GUEST_VIEWER.contactNo;
    user.password = GUEST_VIEWER.password;
    user.needsPasswordChange = false;
    user.status = 'active';
    user.isDeleted = false;
    user.isVerified = true;
    await user.save();
  } else {
    const id = await generateAdminId();
    const createdUsers = await User.create([
      {
        id,
        userName: GUEST_VIEWER.userName,
        email: GUEST_VIEWER.email,
        contactNo: GUEST_VIEWER.contactNo,
        password: GUEST_VIEWER.password,
        role: USER_ROLE.viewer,
        needsPasswordChange: false,
        status: 'active',
        isDeleted: false,
        isVerified: true,
        referralId: `ADMIN-${id}`,
      },
    ]);
    user = createdUsers[0];
    created = true;
  }

  if (!user) {
    throw new Error('Failed to create guest viewer user');
  }

  const existingAdmin = await Admin.findOne({ user: user._id });
  if (!existingAdmin) {
    await Admin.create({
      id: user.id,
      user: user._id,
      designation: 'Guest Viewer',
      name: { firstName: 'Guest', lastName: 'Admin' },
      userName: GUEST_VIEWER.userName,
      gender: 'other',
      email: GUEST_VIEWER.email,
      contactNo: GUEST_VIEWER.contactNo,
      emergencyContactNo: GUEST_VIEWER.contactNo,
      bloodGroup: 'O+',
      presentAddress: 'View only',
      permanentAddress: 'View only',
      isDeleted: false,
    });
  }

  console.log(created ? 'Created guest viewer admin' : 'Updated guest viewer admin');
  console.log(`Username: ${GUEST_VIEWER.userName}`);
  console.log(`Password: ${GUEST_VIEWER.password}`);
  console.log(`Role: ${USER_ROLE.viewer}`);
  console.log(`Member ID: ${user.id}`);
}

main()
  .catch((err) => {
    console.error('seedGuestViewer failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
