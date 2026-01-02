"use client";
import { createContext, useState } from "react";

export const Rolecontex = createContext();

export const Rolecontexprovider = ({ children }) => {
  const [Role, setRole] = useState("Admin");

  return (
    <Rolecontex.Provider value={{ Role, setRole }}>
      {children}
    </Rolecontex.Provider>
  );
};
