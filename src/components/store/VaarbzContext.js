'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useState, useEffect } from 'react';
export const VaarbzContext = React.createContext({});
export const VaarbzProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('vaarbz-user')));
    const [authUserToken, setAuthUserToken] = useState(localStorage.getItem('vaarbz-user-token'));
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showYourProfile, setShowYourProfile] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [openSidebar, setOpenSidebar] = useState(false); // Initialize as false
    const [typingUsers, setTypingUsers] = useState(new Set());
    // Update `openSidebar` based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (openSidebar) {
                const isWideScreen = window.innerWidth > 570;
                if (isWideScreen) {
                    setOpenSidebar(false); // Set to true if screen width is greater than 570px
                }
                else {
                    setOpenSidebar(true);
                }
                console.log('Window resized:', window.innerWidth, 'Setting openSidebar to:', isWideScreen); // Debug log
                // Ensure it's always a boolean
            }
            //setOpenSidebar(window.innerWidth <= 570); // Set to true if screen width is less than or equal to 570px
        };
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [openSidebar]);
    useEffect(() => {
        try {
            const user = localStorage.getItem('vaarbz-user');
            if (user) {
                const parsedUser = JSON.parse(user);
                if (parsedUser && parsedUser._id) {
                    setAuthUser(parsedUser);
                }
            }
        }
        catch (error) {
            console.error('Error parsing user data:', error);
        }
    }, []);
    useEffect(() => {
        if (authUser && authUser.user) {
            localStorage.setItem('vaarbz-user', JSON.stringify(authUser));
        }
        else {
            localStorage.removeItem('vaarbz-user');
        }
    }, [authUser]);
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const response = await fetch('https://vaarbz.onrender.com/api/users/', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('vaarbz-user-token')}`
                    },
                });
                const usersArray = await response.json();
                setUsers(usersArray.users);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
        const interval = setInterval(fetchUsers, 30000);
        return () => clearInterval(interval);
    }, [authUser]);
    /*  const joinRoom = (userId: string) => {
       if (userId) socket.emit("join_room", userId);
     };
   
     const sendMessageSocket = () => {
       socket.emit("send_message", { message, room });
     }; */
    // Filter users based on searchUser value
    let filteredUsersArray = users?.filter(user => user.username.toLowerCase().includes(searchUser.toLowerCase()));
    return (_jsx(VaarbzContext.Provider, { value: {
            authUser, setAuthUser, authUserToken, setAuthUserToken,
            users, setUsers,
            loadingUsers,
            selectedUser, setSelectedUser,
            showYourProfile, setShowYourProfile,
            showUserProfile, setShowUserProfile,
            searchUser, setSearchUser,
            showEditProfile, setShowEditProfile,
            message, setMessage,
            messages, setMessages, filteredUsersArray,
            openSidebar, setOpenSidebar, typingUsers, setTypingUsers,
        }, children: children }));
};
