import React, { useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:bg-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({user, closeToggle}) => {

  const handleCloseSidebar = (e) => {
    if (closeToggle !== undefined)
      closeToggle(false);
  }

  useEffect(() => console.log('user', user, 'close', closeToggle), []);

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar rounded-lg'>
      <div className="flex flex-col">
        <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt='logo' className='w-full' />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to='/'
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={e => handleCloseSidebar(e)}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map(category => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
              onClick={e => handleCloseSidebar(e)}
              key={category.name}
            >
              <img src={category.image} alt='category-image' className='h-10 w-10 rounded-xl '/>
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {
        user && (
          <Link to={`user-profile/${user._id}`} className='flex items-center my-5 p-2 gap-3 mb-3 bg-white rounded-lg shadow-lg mx-3' onClick={handleCloseSidebar}>
            <img src={user.image} alt='user-image' className='w-10 h-10 rounded-md '/>
            <p>{user.userName}</p>
          </Link>
        )
      }
    </div>
  )
}

export default Sidebar