import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import '../../../styles/components/userprofile.scss';
import { IoArrowBackSharp } from "react-icons/io5";
import toast from 'react-hot-toast';
import { VaarbzContext } from '../../store/VaarbzContext';
const EditProfile = () => {
    const { authUser, setAuthUser, authUserToken, setShowEditProfile, setShowYourProfile } = useContext(VaarbzContext);
    const [username, setUsername] = useState(authUser.user.username);
    const [status, setStatus] = useState(authUser.user.status);
    const [city, setCity] = useState(authUser.user.city);
    const [age, setAge] = useState(authUser.user.age);
    const [profilePicture, setProfilePicture] = useState(null);
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };
    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('status', status);
            formData.append('city', city);
            formData.append('age', age);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }
            const response = await fetch(`https://vaarbz.onrender.com/api/users/updateprofile/${authUser.user._id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    Authorization: `Bearer ${authUserToken}`,
                },
            });
            if (response.ok) {
                toast.success('Profile updated successfully');
                // Update authUser object
                const updatedUser = {
                    ...authUser.user,
                    username: username,
                    status: status,
                    city: city,
                    age: age,
                    profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : authUser.user.profilePicture,
                };
                // Update local storage
                setAuthUser({
                    ...authUser,
                    user: updatedUser,
                });
                // Remove old items from local storage
                localStorage.removeItem('vaarbz-user');
                localStorage.removeItem('vaarbz-user-token');
                // Store updated items in local storage
                localStorage.setItem('vaarbz-user', JSON.stringify(updatedUser));
                localStorage.setItem('vaarbz-user-token', authUserToken);
            }
            else {
                toast.error('Failed to update profile');
            }
        }
        catch (e) {
            toast.error(e.message);
        }
    };
    return (_jsxs("section", { className: "userprofile", children: [_jsx(IoArrowBackSharp, { className: 'close-icon', size: 25, onClick: () => {
                    setShowEditProfile(false);
                    setShowYourProfile(true);
                } }), _jsxs("div", { className: "userprofile-content", children: [_jsxs("form", { className: "edit-profile", children: [_jsxs("div", { className: "edit-section", children: [_jsx("label", { htmlFor: "username", children: "username:" }), _jsx("input", { type: "text", value: username, className: 'edit-input', onChange: (e) => setUsername(e.target.value) })] }), _jsxs("div", { className: "edit-section", children: [_jsx("label", { htmlFor: "username", children: "status:" }), _jsx("input", { type: "text", value: status, className: 'edit-input', onChange: (e) => setStatus(e.target.value) })] }), _jsxs("div", { className: "edit-section", children: [_jsx("label", { htmlFor: "username", children: "city:" }), _jsx("input", { type: "text", value: city, className: 'edit-input', onChange: (e) => setCity(e.target.value) })] }), _jsxs("div", { className: "edit-section", children: [_jsx("label", { htmlFor: "username", children: "age:" }), _jsx("input", { type: "number", value: age, className: 'edit-input', onChange: (e) => setAge(e.target.value) })] }), _jsxs("div", { className: "edit-section choose", children: [_jsx("label", { htmlFor: "username", children: "profile picture:" }), _jsx("input", { type: "file", className: 'choose-file', onChange: handleImageChange })] })] }), _jsx("button", { className: "editprofile", type: 'submit', onClick: updateUser, children: "Save Changes" })] })] }));
};
export default EditProfile;
