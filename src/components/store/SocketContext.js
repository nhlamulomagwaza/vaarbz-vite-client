'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { VaarbzContext } from './VaarbzContext';
const SocketContext = createContext();
export const useSocketContext = () => {
    return useContext(SocketContext);
};
export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useContext(VaarbzContext);
    useEffect(() => {
        if (authUser) {
            const socket = io("https://vaarbz.onrender.com", {
                query: {
                    userId: authUser.user?._id,
                },
            });
            setSocket(socket);
            console.log('socket object ', socket);
            // socket.on() is used to listen to the events. can be used both on client and server side
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
                console.log("these are the Online users:");
                console.log(users);
            });
            return () => socket.close();
        }
        else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);
    return _jsx(SocketContext.Provider, { value: { socket, onlineUsers }, children: children });
};
