import { useContext } from "react";
import AuthContext from "../context/auth/AuthContext";

export default function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}