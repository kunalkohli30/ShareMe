import React, { useState, useRef, useEffect, createContext } from "react";
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";
import sanityClient from "../../client";
import logo from '../assets/logo.png';
import Pins from "./Pins";
import { userQuery } from "../utils/data";

export const UserFromLocalStorageContext = createContext(null);

const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  const navigate = useNavigate();

  useEffect(() => {
    console.log('userinfo from localstorage', userInfo);

    if (!userInfo) {
      navigate('/login')
    } else {
      const query = userQuery(userInfo?.sub);
      sanityClient.fetch(query)
        .then(data => {
          console.log('fetched user', data[0].image);
          setUser(data[0]);
        })
    }
    // .catch(e => console.log('catched', e));
  }, [])

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-full transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row ">
        <div className="flex p-2 w-full flex-row justify-between items-center shadow-md">

          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to='/'>
            <img src={logo} alt='logo' className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt='user_image' className='w-14' />
          </Link>
        </div>

        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-full overflow-y-auto shadow-xl z-10 animate-slide-in ">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll hide-scrollbar" ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={
            <UserFromLocalStorageContext.Provider value={userInfo}>
              <UserProfile />
            </UserFromLocalStorageContext.Provider>} />
          <Route path='/*' element={
            <UserFromLocalStorageContext.Provider value={userInfo}>
              <Pins user={user && user} />
            </UserFromLocalStorageContext.Provider>} />
        </Routes>
      </div>
    </div>
  )
}

export default Home;