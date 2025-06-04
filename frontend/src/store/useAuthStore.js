import { create } from "zustand";   // A library that acts as a global useState
import { axiosInstance } from "../lib/axios.js";    // Axios instance that allows us to communicate with the server
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// useAuthStore grants access to all these global states and methods
export const useAuthStore = create((set, get) => ({  // receives a set function that updates the store's states
    // States
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    // Methods
    checkAuth: async () => {
        // Use axios to use an api endpoint that asks the server to check authentication (Check if JWT exists)
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            set ({ authUser: null });
        } finally {
            // Done checking authentication
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        // Use axios to send a post request to add a new user to the database
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            // Done signing up
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        // Set isLoggingIn to true
        set({ isLoggingIn: true });  
        try {
            // Use axios to create a post request to endpoint for login and set authUser to res.data which is the User
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully!");

            get().connectSocket();
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        console.log("Run");
        try {
            // Use axios to create apost request to endpoint for logout and set authUser to null
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out.");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.log("Error in updateProfile", error);
            toast.error("Error updating the profile.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        // If no authenticated user or there is already a socket that is connected
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, { 
            query: {
                userId: authUser._id,
            }
        });
        socket.connect(); 

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
        
    },

    disconnectSocket: () => {
        // Only try disconnecting if socket is connected
        if (get().socket?.connected) get().socket.disconnect();

    }

}))

