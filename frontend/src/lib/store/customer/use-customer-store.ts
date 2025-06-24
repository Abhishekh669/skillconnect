import { UserType } from '@/lib/types/user/user.types';
import { create } from 'zustand';


type UserStore = {
  user: UserType | null;
  setUser: (userData: UserType) => void;
  resetUser: () => void;
};

export const useCustomerStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userData) => set({ 
    user: userData,
  }),
  resetUser: () => set({ 
    user: null,
  }),
}));


