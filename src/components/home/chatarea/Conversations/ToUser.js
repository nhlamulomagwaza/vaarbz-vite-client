import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../../../styles/components/chatarea.scss';
import { VaarbzContext } from '../../../store/VaarbzContext';
import { useContext } from 'react';
//import useListenMessages from '@/app/hooks/useListenMessages'
import { IoMenuOutline } from 'react-icons/io5';
const ToUser = () => {
    const { selectedUser, setShowUserProfile, setOpenSidebar, openSidebar, typingUsers } = useContext(VaarbzContext);
    return (_jsx("section", { className: "to-user", onClick: () => setShowUserProfile(true), children: _jsxs("div", { className: "touser-content", children: [_jsx("div", { className: "profile-picture", children: _jsx("img", { src: selectedUser.profilePicture, className: 'profile-picture' }) }), _jsxs("div", { className: "user-info", children: [_jsx("p", { className: "username", children: selectedUser.username }), _jsx("p", { className: "status", children: typingUsers.has(selectedUser._id) ? 'typing...' : selectedUser.status })] }), _jsx("button", { className: "users-button2", onClick: (e) => {
                        e.stopPropagation(); // Prevent the event from propagating to the parent
                        setOpenSidebar(!openSidebar);
                    }, children: _jsx(IoMenuOutline, { size: 30, className: "chat-icon" }) })] }) }));
};
export default ToUser;
