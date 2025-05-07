import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FaHeart, FaSmile, FaThumbsUp, FaStar, FaGrin, FaLaugh, FaSadCry, FaAngry, FaSurprise, FaMeh, FaFrown, FaKissWinkHeart, FaCoffee, FaAppleAlt, FaBook } from 'react-icons/fa';
import { VaarbzContext } from '../../store/AppContext';
import { MoonLoader } from 'react-spinners';
import { useSocketContext } from '../../store/SocketContext';
const UsersFixed = () => {
    const context = React.useContext(VaarbzContext);
    const socketContext = useSocketContext();
    if (!context || !socketContext)
        return null;
    const { authUser, loadingUsers, setSelectedUser, selectedUser, users, searchUser } = context;
    const { onlineUsers } = socketContext;
    const emojis = [
        { icon: _jsx(FaHeart, { color: 'red', size: 25 }, "heart"), id: 1 },
        { icon: _jsx(FaSmile, { color: 'yellow', size: 25 }, "smile"), id: 2 },
        { icon: _jsx(FaThumbsUp, { color: 'blue', size: 25 }, "thumbsup"), id: 3 },
        { icon: _jsx(FaStar, { color: 'gold', size: 25 }, "star"), id: 4 },
        { icon: _jsx(FaGrin, { color: 'green', size: 25 }, "grin"), id: 5 },
        { icon: _jsx(FaLaugh, { color: 'orange', size: 25 }, "laugh"), id: 6 },
        { icon: _jsx(FaSadCry, { color: 'pink', size: 25 }, "sadcry"), id: 7 },
        { icon: _jsx(FaAngry, { color: 'red', size: 25 }, "angry"), id: 8 },
        { icon: _jsx(FaSurprise, { color: 'pink', size: 25 }, "surprise"), id: 9 },
        { icon: _jsx(FaMeh, { color: 'grey', size: 25 }, "meh"), id: 10 },
        { icon: _jsx(FaFrown, { color: 'darkgrey', size: 25 }, "frown"), id: 11 },
        { icon: _jsx(FaKissWinkHeart, { color: 'lightpink', size: 25 }, "kiss"), id: 12 },
        { icon: _jsx(FaCoffee, { color: 'brown', size: 25 }, "coffee"), id: 13 },
        { icon: _jsx(FaAppleAlt, { color: 'red', size: 25 }, "apple"), id: 14 },
        { icon: _jsx(FaBook, { color: 'blue', size: 25 }, "book"), id: 15 },
    ];
    const getRandomEmoji = () => {
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex].icon;
    };
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };
    React.useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('selectedUser') || 'null');
        if (storedUser && setSelectedUser) {
            setSelectedUser(storedUser);
        }
    }, [setSelectedUser]);
    React.useEffect(() => {
        if (selectedUser) {
            localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
        }
        else {
            localStorage.removeItem('selectedUser');
        }
    }, [selectedUser]);
    const filteredUsers = users?.filter(user => user._id !== authUser?._id &&
        user.username.toLowerCase().includes(searchUser.toLowerCase()));
    return (_jsxs("section", { className: "users", children: [loadingUsers ? (_jsx(MoonLoader, { color: '#b0b0b0', className: 'users-loader' })) : (filteredUsers?.map((user) => (_jsxs("div", { className: `user ${selectedUser?._id === user._id ? 'selected-user' : ''}`, onClick: () => handleUserSelect(user), children: [_jsxs("div", { className: "user-meta", children: [_jsx("img", { src: user.profilePicture, className: 'profile-picture', alt: `${user.username}'s profile` }), _jsx("div", { className: onlineUsers.includes(user._id) ? 'online' : '' }), _jsxs("div", { className: "username", children: [user.username, _jsxs("span", { children: ["Joined: ", new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })] })] })] }), _jsx("div", { className: "random-emoji", children: getRandomEmoji() })] }, user.id)))), searchUser && filteredUsers?.length === 0 && !loadingUsers && (_jsxs("p", { className: "no-match", children: ["No user(s) found with the username(s) \"", searchUser, "\""] }))] }));
};
export default UsersFixed;
