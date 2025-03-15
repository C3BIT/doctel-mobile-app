import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { removeUserData } from "../storage/storage";
import { logout } from "../redux/features/auth/patientAuthSlice";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const { token } = useSelector((state) => state.auth); 
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const dispatch = useDispatch();
    const reconnectInterval = useRef(null);

    const connectWebSocket = () => {
        if (!token) {
            console.log("⚠️ No token available, skipping WebSocket connection.");
            return;
        }

        const newSocket = io("https://api.bloomattires.com", {
            transports: ["websocket"],
            extraHeaders: { Authorization: `Bearer ${token}` }, 
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });

        newSocket.on("connect", () => {
            console.log("🔗 WebSocket Connected:", newSocket.id);
            setIsConnected(true);
            clearInterval(reconnectInterval.current);
        });

        newSocket.on("disconnect", (reason) => {
            console.log("❌ WebSocket Disconnected:", reason);
            setIsConnected(false);
            attemptReconnect();
        });

        newSocket.on("error", (error) => {
            console.error("⚠️ WebSocket Error:", error);
        });

        newSocket.on("token_expired", async () => {
            console.log("⏳ Token expired, logging out user...");
            dispatch(logout());
        });
        setSocket(newSocket);
    };

    const attemptReconnect = () => {
        if (!isConnected) {
            reconnectInterval.current = setInterval(() => {
                console.log("♻️ Attempting WebSocket Reconnect...");
                connectWebSocket();
            }, 5000);
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [token]); 

    return (
        <WebSocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
