"use client";

import createApiClient from "@/app/api-client/baseApi";
import { AxiosInstance } from "axios";
import { createContext, ReactNode, useContext } from "react";

interface IApiContext {
  jsonApiClient: AxiosInstance;
}

const ApiContext = createContext<IApiContext | null>(null);

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const jsonApiClient = createApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    getToken: () => null,
    logout: () => {},
  });

  return (
    <ApiContext.Provider value={{ jsonApiClient }}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  return context;
};

export { ApiProvider, useApi };
