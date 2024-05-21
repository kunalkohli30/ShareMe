import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import sanityClient from '../../client.js';

const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = async response => {
    const decode = jwtDecode(response.credential);
    localStorage.setItem('user', JSON.stringify(decode));
    // console.log(decode);

    const { name, picture, sub } = decode;
    const user = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    sanityClient.createIfNotExists(user)
      .then(() => {
        navigate('/', { replace: true })
      })

    await axios.post(`http://localhost:5173/api/auth`, user);

  }

  // console.log(process.env.REACT_APP_GOOGLE_API_TOKEN);
  return (
    <div className='flex justify-start items-center flex-col h-full'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type="video/mp4"
          controls={false}
          muted
          loop
          autoPlay
          className='w-full h-full object-contain '
        />

        <div className='absolute top-0 right-0 left-0 bottom-0 bg-blackOverlay flex justify-center items-center flex-col'>
          <div className="p-5">
            <img src={logo} alt='logo' width='130px' />
          </div>

          <div className=''>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={renderProps =>
                <button
                  type='button'
                  className='bg-mainColor flex items-center p-2 cursor-pointer opacity-70 rounded-xl outline-none'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className='mr-4' />
                  Sign in with Google
                </button>
              }
              onSuccess={responseGoogle}
              onError={error => console.log('Google login error', error)}
              cookiePolicy='single_host_origin'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login