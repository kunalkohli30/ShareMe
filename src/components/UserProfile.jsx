import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import sanityClient from '../../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { UserFromLocalStorageContext } from '../container/Home';

const randomImageUrl = 'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeBtnStyles = "bg-red-500 text-white font-bold rounded-full p-2 w-20 outline-none";
const inActiveBtnStyle = "bg-primary mr-4 text-black font-bold rounded-full p-2 w-20 outline-none";

const UserProfile = () => {

  const [user, setUser] = useState(null);
  const [Pins, setPins] = useState(null);
  const [text, settext] = useState('Created') //created or saved
  const [activeBtn, setActiveBtn] = useState('Created');

  const navigate = useNavigate();

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    sanityClient.fetch(query)
      .then(data => { setUser(data[0]) });
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      sanityClient.fetch(createdPinsQuery)
        .then(data => {
          console.log('user created pins', data);
          setPins(data)
        });
    }
    else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      sanityClient.fetch(savedPinsQuery)
        .then(data => {
          console.log('user saved pins', data);
          setPins(data);
        });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
    console.log('logout');
  }

  if (!user) return <Spinner message='Loading profile' />

  return (
    <div className='relative  pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImageUrl}
              className='w-full h-370 xl:h-510 shadow-lg object-cover'
              alt='banner-pic'
            />
            <img src={user?.image} alt="user-pic" className="rounded-full w-20 h-20 -mt-10 shadow-xl" />
            <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {
                userId === user._id &&
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={renderProps =>
                    <button
                      type='button'
                      className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color='red' fontSize={21} />
                      Logout
                    </button>
                  }
                  onLogoutSuccess={logout}
                  onFailure={() => 'logout failure'}
                  cookiePolicy='single_host_origin'
                />
              }
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type='button'
              onClick={e => {
                settext(e.target.textContent);
                setActiveBtn('Created');
              }}
              className={activeBtn === 'Created' ? activeBtnStyles : inActiveBtnStyle}
            >
              Created
            </button>
            <button
              type='button'
              onClick={e => {
                settext(e.target.textContent);
                setActiveBtn('Saved');
              }}
              className={activeBtn === 'Saved' ? activeBtnStyles : inActiveBtnStyle}
            >
              Saved
            </button>
          </div>
          {Pins?.length ? <div className="px-2">
            <MasonryLayout pins={Pins} />
          </div> : <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
            No Pins Found
          </div>
          }
        </div>
      </div>

    </div>
  )
}

export default UserProfile