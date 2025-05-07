
import React, { useContext, useState } from 'react'
import '../../../styles/components/userprofile.scss';
import { IoArrowBackSharp } from "react-icons/io5";
import toast from 'react-hot-toast';


import { FaPen } from "react-icons/fa";
import { VaarbzContext } from '../../store/VaarbzContext';

const EditProfile = () => {

  const {authUser, setAuthUser, authUserToken, setShowEditProfile, setShowYourProfile}= useContext(VaarbzContext);
      const [username, setUsername] = useState(authUser.user.username);
  const [status, setStatus] = useState(authUser.user.status);
  const [city, setCity] = useState(authUser.user.city);
  const [age, setAge] = useState(authUser.user.age);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } else {
        toast.error('Failed to update profile');
      }
    } catch (e) {
      toast.error(e.message as string);
    }
  };

  return (
    <section className="userprofile">
   <IoArrowBackSharp className='close-icon' size={25} onClick={()=> {
    setShowEditProfile(false)
  setShowYourProfile(true)
  }}/>

   <div className="userprofile-content">

               <form className="edit-profile">
               

               <div className="edit-section">
                <label htmlFor="username">username:</label>
               <input type="text" value={username} className='edit-input' 
               onChange={(e) => setUsername(e.target.value)}
               />
               </div>
               <div className="edit-section">
                <label htmlFor="username">status:</label>
               <input type="text" value={status} className='edit-input' 
               onChange={(e) => setStatus(e.target.value)}
               />
               </div>
               <div className="edit-section">
                <label htmlFor="username">city:</label>
               <input type="text" value={city} className='edit-input'
               onChange={(e) => setCity(e.target.value)}
               />
               </div>

               <div className="edit-section">
               <label htmlFor="username">age:</label>
               <input type="number" value={age} className='edit-input'
               onChange={(e) => setAge(e.target.value)}
               />
               </div>
               <div className="edit-section choose">
               <label htmlFor="username">profile picture:</label>
               <input type="file" className='choose-file' onChange={handleImageChange}/>

               </div>
               </form>
   {/*      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" className='profile-picture' />
        <p className="username-age">Menna (You) , 24</p>
        <p className="status">Can't talk Vaarbz only ✌️</p>
        <p className="gender-city">Female, Pretoria</p> */}
        <button className="editprofile" type='submit' onClick={updateUser}>Save Changes
        </button>

        
   </div>


 </section>
  )
}

export default EditProfile