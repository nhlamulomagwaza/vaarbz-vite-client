import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../../styles/components/userprofile.scss';
import { IoMdClose } from "react-icons/io";
import { FaPen } from "react-icons/fa";
import { VaarbzContext } from '../../store/VaarbzContext';
import { useContext } from 'react';
const Yourprofile = () => {
    const { setShowYourProfile, authUser, setShowEditProfile } = useContext(VaarbzContext);
    return (_jsxs("section", { className: "userprofile", children: [_jsx(IoMdClose, { className: 'close-icon', size: 25, onClick: () => setShowYourProfile(false) }), _jsxs("div", { className: "userprofile-content", children: [_jsx("img", { src: authUser.user.profilePicture, className: 'profile-picture' }), _jsxs("p", { className: "username-age", children: [authUser.user.username, " (You) , ", authUser.user.age] }), _jsx("p", { className: "status", children: authUser.user.status }), _jsxs("p", { className: "gender-city", children: [authUser.user.gender, ", ", authUser.user.city] }), _jsxs("button", { className: "editprofile", onClick: () => {
                            setShowEditProfile(true);
                            setShowYourProfile(false);
                        }, children: ["Edit Profile ", _jsx(FaPen, {})] })] })] }));
};
export default Yourprofile;
