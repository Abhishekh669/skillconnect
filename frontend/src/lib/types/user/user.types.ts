export type UserType = {
  userId: string;
  username: string;
  email: string;
  image: string;
  userRole: 'customer' | 'employee' | 'admin';
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  isOnboarded: boolean;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};