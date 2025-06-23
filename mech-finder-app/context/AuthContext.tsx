import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>({ id: '5', type: 'mechanic' });
  //const [user, setUser] = useState<any>();
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
