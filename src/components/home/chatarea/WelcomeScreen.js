'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext } from 'react';
import '../../../styles/components/chatarea.scss';
import { IoChatbubblesSharp, IoPersonOutline } from "react-icons/io5";
import { VaarbzContext } from '../../store/VaarbzContext';
const WelcomeScreen = () => {
    const { authUser, openSidebar, setOpenSidebar } = useContext(VaarbzContext);
    return (_jsx(_Fragment, { children: _jsxs("section", { className: "welcome-screen", children: [_jsxs("button", { className: 'users-button', onClick: () => setOpenSidebar(!openSidebar), children: ["Users ", _jsx(IoPersonOutline, {})] }), _jsxs("div", { className: "welcome-screen-content", children: [_jsxs("h1", { className: "welcome-title", children: ["Welcome\u270C\uFE0F ", authUser?.user?.username, " \uD83D\uDE01"] }), _jsx("p", { className: "welcome-descption", children: "Select a user to start messaging" }), _jsx(IoChatbubblesSharp, { size: 30, className: 'chat-icon' })] })] }) }));
};
export default WelcomeScreen;
