import {
  use,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";
import { useStorageState } from "./useStorageState";
import {
  login,
  register,
  refreshTokens,
  fetchUser,
} from "./services/authService";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signUp: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => void;
  signOut: () => void;
  accessToken?: string | null;
  isLoading: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}>({
  signIn: (email: string, password: string) => null,
  signUp: (name: string, email: string, password: string, phone: string) =>
    null,
  signOut: () => null,
  accessToken: null,
  isLoading: false,
  user: null,
});

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [[isStorageLoadingAccess, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[isStorageLoadingRefresh, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      if (accessToken) {
        try {
          const userData = await fetchUser(accessToken);
          setUser(userData);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Failed to fetch user"
          ) {
            if (refreshToken) {
              try {
                const refreshData = await refreshTokens(refreshToken);
                setAccessToken(refreshData.accessToken);
                setRefreshToken(refreshData.refreshToken);
                setUser(refreshData.user);
              } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
              }
            } else {
              console.error("No refresh token available to refresh session.");
            }
          } else {
            console.error("Failed to fetch user:", error);
          }
        }
      }
      setIsLoading(false);
    };

    if (!isStorageLoadingAccess && !isStorageLoadingRefresh) {
      initializeSession();
    }
  }, [accessToken, isStorageLoadingAccess, isStorageLoadingRefresh]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          try {
            const data = await login(email, password);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user);
          } catch (error) {
            console.error("Login error:", error);
            throw error;
          }
        },
        signUp: async (name, email, password, phone) => {
          try {
            const data = await register(name, email, password, phone);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user);
          } catch (error) {
            console.error("Registration error:", error);
            throw error;
          }
        },
        signOut: () => {
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        },
        accessToken,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
