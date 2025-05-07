
import React, { useContext, useEffect, useState } from 'react';
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
    } else {
      // Show splash screen for 3 seconds, then hide it
      const timer = setTimeout(() => {
        setShowSplashScreen(false);
        localStorage.setItem('hasSeenSplash', 'true'); // Set the flag in localStorage
      }, 6000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, []);

  if (showSplashScreen) {
    return (
      <div className="splash-screen">
     <h1 className="animated-title">
  <span className="letter">V</span>
  <span className="letter">a</span>
  <span className="letter">a</span>
  <span className="letter">r</span>
  <span className="letter">b</span>
  <span className="letter">z</span>
  <span className="emoji">✌️</span>
</h1>      <p><ScaleLoader color="#36d7b7" height={20} width={9} /></p>
      </div>
    );
  }

  return (
    <>
      <section className="home">
        {authUser ? (
          <div className="home-content">
            <Sidebar />
            <ChatArea />

            {showYourProfile && !showEditProfile ? <Yourprofile /> : null}

            {!showYourProfile && showEditProfile ? <EditProfile /> : null}

            {showUserProfile ? <Userprofile /> : null}
          </div>
        ) : (
          <Sign />
        )}
      </section>
      <Toaster />
    </>
  );
};