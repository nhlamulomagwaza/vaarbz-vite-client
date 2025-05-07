import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import '../../../styles/components/sidebar.scss';
import { FaHeart, FaSmile, FaThumbsUp, FaStar, FaGrin, FaLaugh, FaSadCry, FaAngry, FaSurprise, FaMeh, FaFrown, FaKissWinkHeart, FaCoffee, FaAppleAlt, FaBook } from 'react-icons/fa'; // Import additional icons
import { VaarbzContext } from '../../store/VaarbzContext';
import { MoonLoader } from 'react-spinners';
import { useSocketContext } from '../../store/SocketContext';
import toast from 'react-hot-toast';
const Users = () => {
    const { users, authUser, loadingUsers, setSelectedUser, selectedUser, filteredUsersArray, searchUser, messages } = React.useContext(VaarbzContext);
    const { socket } = useSocketContext();
    // Handle typing events
    const [typingUsers, setTypingUsers] = useState(new Set()); // Track multiple typing users
    const { onlineUsers } = useSocketContext();
    const isOnline = (userId) => onlineUsers.some((user) => user.userId === userId);
    // Helper function to get the latest message for a user
    const getLatestMessage = (userId) => {
        const userMessages = messages.filter((message) => (message.senderId === userId && message.receiverId === authUser.user._id) ||
            (message.receiverId === userId && message.senderId === authUser.user._id));
        if (userMessages.length === 0)
            return null; // No messages for this user
        return userMessages.reduce((latest, current) => new Date(latest.createdAt).getTime() > new Date(current.createdAt).getTime() ? latest : current);
    };
    // Handle typing events
    useEffect(() => {
        if (!socket)
            return;
        const handleTyping = ({ senderId }) => {
            console.log(`User with ID ${senderId} is typing...`);
            setTypingUsers((prev) => {
                const updated = new Set(prev);
                updated.add(senderId); // Add the senderId to the set
                return updated;
            });
        };
        const handleStopTyping = ({ senderId }) => {
            console.log(`User with ID ${senderId} stopped typing.`);
            setTypingUsers((prev) => {
                const updated = new Set(prev);
                updated.delete(senderId); // Remove the senderId from the set
                return updated;
            });
        };
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        return () => {
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
        };
    }, [socket]);
    // Array of emoji components
    const emojis = [
        _jsx(FaHeart, { color: 'red', size: 25 }),
        _jsx(FaSmile, { color: 'yellow', size: 25 }),
        _jsx(FaThumbsUp, { color: 'blue', size: 25 }),
        _jsx(FaStar, { color: 'gold', size: 25 }),
        _jsx(FaGrin, { color: 'green', size: 25 }),
        _jsx(FaLaugh, { color: 'orange', size: 25 }),
        _jsx(FaSadCry, { color: 'pink', size: 25 }),
        _jsx(FaAngry, { color: 'red', size: 25 }),
        _jsx(FaSurprise, { color: 'pink', size: 25 }),
        _jsx(FaMeh, { color: 'grey', size: 25 }),
        _jsx(FaFrown, { color: 'darkgrey', size: 25 }),
        _jsx(FaKissWinkHeart, { color: 'lightpink', size: 25 }),
        _jsx(FaCoffee, { color: 'brown', size: 25 }),
        _jsx(FaAppleAlt, { color: 'red', size: 25 }),
        _jsx(FaBook, { color: 'blue', size: 25 }),
    ];
    console.log(selectedUser);
    // Function to get a random emoji
    const getRandomEmoji = () => {
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    };
    const handleUserSelect = (user) => {
        setSelectedUser(user); // Set the selected user when a user is clicked
    };
    // Restore selected user from localStorage
    React.useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('selectedUser'));
        if (storedUser) {
            setSelectedUser(storedUser);
        }
    }, []);
    // Update selected user in localStorage
    React.useEffect(() => {
        if (selectedUser) {
            localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
        }
        else {
            localStorage.removeItem('selectedUser');
        }
    }, [selectedUser]);
    console.log("online users:");
    console.log(onlineUsers);
    // Helper function to get username by user ID
    const getUsernameById = (userId) => {
        // First check in the onlineUsers array
        const onlineUser = onlineUsers.find(u => u.userId === userId);
        if (onlineUser?.username)
            return onlineUser.username;
        // Fallback to checking in the users array
        const user = users?.find(u => u._id === userId);
        return user?.username || userId; // Final fallback to ID
    };
    const notifiedUsers = React.useRef(new Set());
    useEffect(() => {
        if (!onlineUsers || !authUser?.user?._id)
            return;
        onlineUsers.forEach((onlineUser) => {
            if (onlineUser.userId !== authUser.user._id && !notifiedUsers.current.has(onlineUser.userId)) {
                const username = getUsernameById(onlineUser.userId);
                toast(`${username} is online`, {
                    icon: '🟢',
                    style: { background: '#f0fff0' },
                    duration: 3000,
                });
                notifiedUsers.current.add(onlineUser.userId); // Mark this user as notified
            }
        });
    }, [users]);
    // Sort users so that online users appear first
    const getLatestMessageTimestamp = (userId) => {
        const userMessages = messages.filter((message) => message.senderId === userId || message.receiverId === userId);
        if (userMessages.length === 0)
            return 0; // No messages for this user
        return Math.max(...userMessages.map((message) => new Date(message.createdAt).getTime()));
    };
    // Sort users by online status
    const sortedUsers = filteredUsersArray?.slice().sort((a, b) => {
        const aIsOnline = isOnline(a._id);
        const bIsOnline = isOnline(b._id);
        // Online users come first
        return bIsOnline - aIsOnline;
    });
    return (_jsx(_Fragment, { children: _jsxs("section", { className: "users", children: [loadingUsers ? (_jsx(MoonLoader, { color: "#b0b0b0", className: "users-loader" })) : (sortedUsers
                    ?.filter((user) => user._id !== authUser.user._id)
                    .map((user) => {
                    const latestMessage = getLatestMessage(user._id);
                    const isTyping = typingUsers.has(user._id);
                    return (_jsxs("div", { className: `user ${selectedUser?._id === user._id ? 'selected-user' : 'user'}`, onClick: () => handleUserSelect(user), children: [_jsxs("div", { className: "user-meta", children: [_jsx("img", { src: user.profilePicture, className: "profile-picture", alt: `${user.username}'s profile` }), _jsx("div", { className: isOnline(user._id) ? 'online-status' : null }), _jsxs("div", { className: "username", children: [user.username, ' ', _jsx("span", { children: isTyping ? (_jsx("p", { style: { color: 'lime' }, children: "typing..." })) : latestMessage ? (_jsx("p", { style: {
                                                        color: latestMessage.senderId === authUser.user._id
                                                            ? 'white'
                                                            : 'lime',
                                                    }, children: latestMessage.message })) : (`Joined: ${new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}`) })] })] }), _jsxs("div", { className: "random-emoji", children: [getRandomEmoji(), " "] })] }, user._id));
                })), searchUser.length > 0 && filteredUsersArray.length === 0 && !loadingUsers ? (_jsxs("p", { className: "no-match", children: ["No user(s) found with the username(s) \"", searchUser, "\""] })) : null] }) }));
};
export default Users;
