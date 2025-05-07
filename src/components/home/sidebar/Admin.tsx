
import React, { useContext } from 'react'
import '../../../styles/components/sidebar.scss';
import { PiCross, PiSignOutBold, PiX } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import toast from 'react-hot-toast';
import { VaarbzContext } from '../../store/VaarbzContext';


const Admin = () => {

  const {showYourProfile, setShowYourProfile, openSidebar, setOpenSidebar}= useContext(VaarbzContext);

  const logOutUser = () => {
     

    const confirmLogout= confirm('Are you sure you want to log out?');


    if(confirmLogout){
      localStorage.removeItem('vaarbz-user');
      toast.success('Logout successful');
      setTimeout(() => {
        location.reload();
      }, 1000);
    }

   

  }
  return (
   <section className="admin">



<CgProfile  size={23}  className='admin-icon' onClick={()=> setShowYourProfile(true)}/>
  <PiX size={23} className='admin-icon admin-close' onClick={()=> setOpenSidebar(!openSidebar)}/>
<PiSignOutBold size={23} className='admin-icon' onClick={logOutUser}/>

   </section>
  )
}

export default Admin