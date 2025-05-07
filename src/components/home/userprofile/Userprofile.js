import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../../styles/components/userprofile.scss';
import { IoMdClose } from "react-icons/io";
import { VaarbzContext } from '../../store/VaarbzContext';
import { useContext } from 'react';
const Userprofile = () => {
    const { userProfile, setShowUserProfile, selectedUser } = useContext(VaarbzContext);
    return (_jsxs("section", { className: "userprofile", children: [_jsx(IoMdClose, { className: 'close-icon', size: 25, onClick: () => setShowUserProfile(false) }), _jsxs("div", { className: "userprofile-content", children: [_jsx("img", { src: selectedUser.profilePicture, className: 'profile-picture' }), _jsxs("p", { className: "username-age", children: [selectedUser.username, " , ", selectedUser.age] }), _jsx("p", { className: "status", children: selectedUser.status }), _jsxs("p", { className: "gender-city", children: [selectedUser.gender, ", ", selectedUser.city] })] })] }));
};
export default Userprofile;
