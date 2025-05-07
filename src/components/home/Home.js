import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import ChatArea from './chatarea/ChatArea';
import '../../styles/components/home.scss';
import Userprofile from './userprofile/Userprofile';
import Yourprofile from './userprofile/Yourprofile';
import EditProfile from './userprofile/EditProfile';
import Sign from '../auth/Sign';
import { Toaster } from 'react-hot-toast';
import { VaarbzContext } from '../store/VaarbzContext';
import { ScaleLoader } from 'react-spinners';
export const Home = () => {
    const { authUser, showEditProfile, showYourProfile, showUserProfile } = useContext(VaarbzContext);
    const [showSplashScreen, setShowSplashScreen] = useState(true); // State for splash screen
    useEffect(() => {
        // Check if the user has already seen the splash screen
        const hasSeenSplash = localStorage.getItem('hasSeenSplash');
        if (hasSeenSplash) {
            setShowSplashScreen(false); // Hide splash screen if the flag exists
        }
        else {
            // Show splash screen for 3 seconds, then hide it
            const timer = setTimeout(() => {
                setShowSplashScreen(false);
                localStorage.setItem('hasSeenSplash', 'true'); // Set the flag in localStorage
            }, 6000);
            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, []);
    if (showSplashScreen) {
        return (_jsxs("div", { className: "splash-screen", children: [_jsxs("h1", { className: "animated-title", children: [_jsx("span", { className: "letter", children: "V" }), _jsx("span", { className: "letter", children: "a" }), _jsx("span", { className: "letter", children: "a" }), _jsx("span", { className: "letter", children: "r" }), _jsx("span", { className: "letter", children: "b" }), _jsx("span", { className: "letter", children: "z" }), _jsx("span", { className: "emoji", children: "\u270C\uFE0F" })] }), "      ", _jsx("p", { children: _jsx(ScaleLoader, { color: "#36d7b7", height: 20, width: 9 }) })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx("section", { className: "home", children: authUser ? (_jsxs("div", { className: "home-content", children: [_jsx(Sidebar, {}), _jsx(ChatArea, {}), showYourProfile && !showEditProfile ? _jsx(Yourprofile, {}) : null, !showYourProfile && showEditProfile ? _jsx(EditProfile, {}) : null, showUserProfile ? _jsx(Userprofile, {}) : null] })) : (_jsx(Sign, {})) }), _jsx(Toaster, {})] }));
};
