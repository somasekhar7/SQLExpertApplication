import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { AppDispatch } from "../store";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

// ----------------------
//  INTERFACES
// ----------------------
interface RecentActivity {
  title: string;
  pointsEarned: number;
  solvedAt: string;
}

interface Streak {
  current: number;
  longest: number;
  lastActiveDate: string;
}
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface User {
  avatar: string;
  name: string;
  _id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  role?: string;

  points?: number;
  problemsSolved?: number;

  streak?: Streak;
  recentActivity?: RecentActivity[];

  // backend achievements
  achievements?: Achievement[];

  // progress stats
  progressStats?: {
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  solvedSlugs?: string[]; // ✅ NEW
}

// For error responses from backend
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// For successful responses from backend
type AuthResponse = User;

// ----------------------
//  INITIAL STATE
// ----------------------

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

// ----------------------
//  SLICE
// ----------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
    },
    authSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    authFailure: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  // ▶ REQUIRED FOR fetchProfile thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        state.user = {
          ...(state.user || {}),
          ...action.payload,
          progressStats: action.payload.progressStats,
        };
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loadUserProgress.fulfilled, (state, action) => {
        state.solvedSlugs = action.payload; // ✅ NEW
      });
  },
});
export type { User, RecentActivity, Streak };

export const { authStart, authSuccess, authFailure, logoutSuccess } =
  authSlice.actions;

// ----------------------
//  HELPERS
// ----------------------

// Utility to extract clean error messages from Axios
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorResponse>;
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Something went wrong"
    );
  }
  if (error instanceof Error) return error.message;
  return "Unexpected error occurred";
};

// ----------------------
//  ASYNC THUNKS
// ----------------------

// 🔐 Login
export const loginUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(authStart());
      const res = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      dispatch(authSuccess(res.data));
      dispatch(loadUserProgress()); // ← ADD THIS
      toast.success(`Welcome back, ${res.data.fullName}`);
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      console.error("Login error:", message);
      dispatch(authFailure());
    }
  };
};

// 🆕 Signup
export const signupUser = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(authStart());
      const res = await api.post<AuthResponse>("/auth/signup", {
        fullName,
        email,
        password,
        confirmPassword,
      });
      dispatch(authSuccess(res.data));
      dispatch(loadUserProgress()); // ← ADD THIS
      toast.success("Account created successfully!");
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      console.error("Signup error:", message);
      dispatch(authFailure());
    }
  };
};

// 🔑 Google Login
export const googleLogin = (token: string) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      console.log("🔥 [googleLogin] Received token from UI:", token);
      console.log("🔥 [googleLogin] typeof token:", typeof token);

      dispatch(authStart());

      console.log("📤 [googleLogin] Sending payload to backend:", {
        token,
      });

      const res = await api.post<AuthResponse>("/auth/google", { token });

      console.log("✅ [googleLogin] Backend responded with:", res.data);

      dispatch(authSuccess(res.data));
      dispatch(loadUserProgress());

      toast.success(`Signed in as ${res.data.fullName}`);
    } catch (error) {
      const message = extractErrorMessage(error);

      console.error("❌ [googleLogin] Error message:", message);

      if (axios.isAxiosError(error)) {
        console.error("❌ [googleLogin] Axios full error:", error);
        console.error(
          "❌ [googleLogin] Axios error response data:",
          error.response?.data
        );
        console.error(
          "❌ [googleLogin] Axios error request body:",
          error.config?.data
        );
      }

      toast.error("Google login failed: " + message);
      dispatch(authFailure());
    }
  };
};

// 🔒 Logout
export const logoutUser = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      dispatch(logoutSuccess());
      toast.info("Logged out successfully");
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error("Error logging out: " + message);
    }
  };
};

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profileRes = await api.get("/user/profile", {
        withCredentials: true,
      });

      const progressRes = await api.get("/user/progress", {
        withCredentials: true,
      });

      return {
        ...profileRes.data,
        progressStats: progressRes.data,
      };
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load profile"
      );
    }
  }
);

// 🚀 Load solved problems from backend
export const loadUserProgress = createAsyncThunk(
  "auth/loadUserProgress",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/solved", {
        withCredentials: true,
      });
      return res.data.slugs;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load progress"
      );
    }
  }
);

export default authSlice.reducer;
