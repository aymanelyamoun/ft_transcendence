import React, { createContext, Dispatch, SetStateAction } from "react";

interface User {
  id?: string;
  email?: string;
  username?: string;
  profilePic?: string;
  hash?: string;
  typeLog?: string;
  isTwoFactorEnabled?: boolean;
  isConfirmed2Fa?: boolean;
}

interface UserContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});
  