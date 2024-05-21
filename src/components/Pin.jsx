import React, { useContext, useEffect, useState } from 'react'
import client, { urlFor } from '../../client';
import sanityClient from '../../client';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { UserFromLocalStorageContext } from '../container/Home';
import { AiTwotoneDelete } from 'react-icons/ai';

const Pin = ({ pin }) => {

    const user = useContext(UserFromLocalStorageContext);

    const alreadySaved = !!(pin?.save?.filter(item => {return (item.userId === user.sub)?.length }));

    // useEffect(() => console.log('Already saved value', alreadySaved, pin), []);

    const savePin = id => {
        // console.log('alreadySaved', alreadySaved);
        if (!alreadySaved) {
            setsavingPost(true);

            sanityClient
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setsavingPost(false);
                })
        }
    }

    const deletePin = id => {
        client
            .delete(id)
            .then(() => window.location.reload());
    }
    const navigate = useNavigate();

    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setsavingPost] = useState(false);

    // useEffect(() => console.log('user Data', user), []);

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`pin-details/${pin._id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img
                    className='rounded-lg w-full'
                    src={pin.image.asset.url}
                    alt='user-post'
                />
                {postHovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{ height: '100%' }}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    href={`${pin.image?.asset?.url}?dl=`}
                                    download
                                    onClick={e => e.stopPropagation()}
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-xl text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                                    {pin?.save?.length} Saved
                                </button>
                            ) : (
                                <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                    onClick={e => {
                                        e.stopPropagation();
                                        savePin(pin?._id);
                                    }}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        <div className='flex justify-between  items-center gap-2 w-full'>
                            {
                                pin?.destination &&
                                <a
                                    href={pin?.href}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-white  flex items-center gap-2 font-bold text-black p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {pin.destination.length > 20 ? pin.destination?.slice(8, 25) : pin.destination.slice(8)}
                                </a>
                            }
                            {
                                pin?.postedBy?._id === user.sub && (
                                    <button type='button' className='bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                        onClick={e => {
                                            e.stopPropagation();
                                            deletePin(pin?._id);
                                        }}
                                    >
                                        <AiTwotoneDelete />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )}

            </div>

            <Link
                to={`user-profile/${user?.sub}`}
                className='flex gap-2 mt-2 items-center'
            >
                <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={pin.postedBy?.image}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize'>{pin?.postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin