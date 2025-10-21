"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const axiosUsers = axios.create({
  baseURL: "https://solutions-api.moffin.mx/api",
  withCredentials: true,
});

type LoginRequest = {
  email: string;
  password: string;
  emailAsOtherUser?: string;
  onSuccess: () => void;
};

interface SingupProps {
  email: string | null;
  password: string | null;
  mark: string | null;
  onSuccess: () => void;
}

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
  permissions: Array<any>;
  token: string;
}

interface Organization {
  id: number;
  name: string;
  slug: string;
  rootOrganizationId: number;
}

export const fetchSigninUser = createAsyncThunk(
  "authentication/signin",
  async (action: LoginRequest, metadata) => {
    try {
      const resp = await axiosUsers.post("/v1/auth", {
        email: action.email,
        password: action.password,
      });
      const { data } = resp;
      localStorage.setItem("accessToken", data.token);
      action.onSuccess();
      return data;
    } catch (error) {
      throw new Error();
    }
  }
);

export const fetchSigninAsOtherUser = createAsyncThunk(
  "authentication/signinAsOtherUser",
  async (action: LoginRequest, metadata) => {
    try {
      const resp = await axiosUsers.post("/v1/auth/other", {
        email: action.emailAsOtherUser,
        password: action.password,
        user: action.email,
      });
      const { data } = resp;
      localStorage.setItem("accessToken", data.token);
      
      // Sync with NextAuth session
      try {
        await fetch("/api/auth/sync-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: data.token,
            userData: data.user,
          }),
        });
      } catch (syncError) {
        console.error("Failed to sync session:", syncError);
      }
      
      action.onSuccess();
      return data;
    } catch (error) {
      throw new Error();
    }
  }
);

export const fetchSigupUser = createAsyncThunk(
  "authentication/signup",
  async (action: SingupProps, metadata) => {
    try {
      const resp = await axiosUsers.post("/users/signup", {
        email: action.email,
        password: action.password,
        mark: action.mark,
        country: "AR",
        plan: "free",
      });
      const { data } = resp;
      localStorage.setItem("accessToken", data.token);
      action.onSuccess();
      return data;
    } catch (error) {
      throw new Error();
    }
  }
);

export const fetchGetUser = createAsyncThunk(
  "authentication/currentuser",
  async (action, metadata) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const resp = await axiosUsers.get("/v1/user/info", {
        withCredentials: true,
        headers: {
          authorization: "Bearer " + token,
        },
      });
      const { data } = resp;
      return data;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem("accessToken");
      throw new Error("Failed to fetch user info");
    }
  }
);

export const fetchLogoutUser = createAsyncThunk(
  "authentication/signout",
  async (action: { onSuccess: () => void }, metadata) => {
    try {
      const token = localStorage.getItem("accessToken");
      const resp = await axiosUsers.post("/v1/auth/logout", {
        withCredentials: true,
        headers: {
          authorization: "Bearer " + token,
        },
      });
      localStorage.removeItem("accessToken");
      const { data } = resp;
      action.onSuccess();
      return data;
    } catch (error) {
      throw new Error();
    }
  }
);

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    user: null as User | null,
    organization: null as Organization | null,
    token: null as string | null,
    isLoading: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetchSigninUser
    builder.addCase(fetchSigninUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchSigninUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.token = action.payload.token;
      }
    );
    builder.addCase(fetchSigninUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
    });

    // Handling fetchSigninAsOtherUser
    builder.addCase(fetchSigninAsOtherUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchSigninAsOtherUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = false;
      }
    );
    builder.addCase(fetchSigninAsOtherUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
    });

    // Handling fetchSignupUser
    builder.addCase(fetchSigupUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchSigupUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.currentUser;
        state.token = action.payload.token;
        state.error = false;
      }
    );
    builder.addCase(fetchSigupUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
    });

    // Handling fetchGetUser
    builder.addCase(fetchGetUser.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(
      fetchGetUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = { ...action.payload.user, token: action.payload.token };
        state.organization = action.payload.organization;
        state.error = false;
      }
    );
    builder.addCase(fetchGetUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
      state.user = null;
      state.organization = null;
      state.token = null;
    });

    // Handling fetchLogoutUser
    builder.addCase(fetchLogoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLogoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.organization = null;
      state.token = null;
    });
    builder.addCase(fetchLogoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export default authenticationSlice.reducer;
