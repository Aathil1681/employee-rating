import cookieKeys from "@/configs/cookieKeys";
import { User } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import Cookie from "js-cookie";

interface IAuthStore {
  states: {
    user: User | null;
    authToken: string | null;
  };
  actions: {
    setUser: Dispatch<SetStateAction<User | null>>;
    setAuthToken: Dispatch<SetStateAction<string | null>>;
    logout: () => void;
  };
}

const useAuthStore = create<IAuthStore>()((set) => ({
  states: {
    user: (JSON.parse(Cookie.get(cookieKeys.USER) || "null") as User) || null,
    authToken:
      ((Cookie.get(cookieKeys.USER_TOKEN) || "null") as string) || null,
  },
  actions: {
    setUser: (value) =>
      set(({ states }) => {
        return {
          states: {
            ...states,
            user: typeof value === "function" ? value(states.user) : value,
          },
        };
      }),
    setAuthToken: (value) =>
      set(({ states }) => {
        return {
          states: {
            ...states,
            authToken:
              typeof value === "function" ? value(states.authToken) : value,
          },
        };
      }),

    logout: () => {
      Cookie.remove(cookieKeys.USER_TOKEN);
      Cookie.remove(cookieKeys.USER);

      return set(({ states }) => {
        return {
          states: {
            ...states,
            authToken: null,
            user: null,
          },
        };
      });
    },
  },
}));

const useAuth = () => useAuthStore((state) => state.states);
const useAuthActions = () => useAuthStore((state) => state.actions);

export { useAuth, useAuthActions };
