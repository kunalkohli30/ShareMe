import React, { useEffect, useState } from 'react'
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import sanityClient, { urlFor } from '../../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data';
import Spinner from './Spinner';

import imageUrlBuilder from "@sanity/image-url/";
import client from '../../client';


const PinDetail = ({ user }) => {

  useEffect(() => console.log('pin-details rendered'), []);

  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // ID...
  const { pinId } = useParams();
  const builder = imageUrlBuilder(sanityClient);
  const urlF = (src) => builder.image(src);

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    sanityClient.fetch(query)
      .then(response => {
        console.log(response[0].image);
        console.log('pin details', urlF(response[0]?.image).url());

        setPinDetail(response[0]);
        console.log('Pin detail', response[0]);
        if (response[0]) {
          query = pinDetailMorePinQuery(response[0]);

          sanityClient.fetch(query)
            .then(data => setPins(data))
        }
      });
  }

  useEffect(() => console.log('recommendations', pins), [pins]);
  const addComment = () => {

    if (comment) {
      setAddingComment(true);

      client.patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then( () => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })
    }
  }

  useEffect(() => {
    fetchPinDetails();
  }, [pinId])

  if (!pinDetail)
    return <Spinner message='Loading Pin...' />

  return (

    <div className='flex xl:flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img
          src={pinDetail?.image && urlF(pinDetail.image).url()}
          className='rounded-t-3xl rounded-b-lg'
          alt='user-post'
        />
      </div>

      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div className="">
          <div className="flex justify-between items-center ">
            <a
              href={`${pinDetail.image.asset.url}?dl=`}
              download
              onClick={e => e.stopPropagation()}
              className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-xl text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none'
            >
              <MdDownloadForOffline />
            </a>
            <a
              href={pinDetail?.destination}
              target='_blank'
              rel='noreferrer'
            >
              {pinDetail.destination.slice(8, 35)}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetail.title}
            </h1>
            <p className='mt-3'>{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className='flex gap-2 mt-5 items-center bg-white rounded-lg'
          >
            <img
              className='w-8 h-8 rounded-full object-cover'
              src={pinDetail.postedBy?.image}
              alt='user-profile'
            />
            <p className='font-semibold capitalize'>{pinDetail?.postedBy?.userName}</p>
          </Link>
          <h2 className='mt-5 text-2xl'>
            Comments
          </h2>
          <div className='max-h-370 overflow-y-auto'>
            {/* Show comments */}
            {pinDetail.comments?.map((comment, i) => (
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                <img src={comment.postedBy?.image} alt='user-profile' className='w-10 h-10 rounded-full cursor-pointer' />
                <div className="flex flex-col">
                  <p className='font-bold'>{comment.postedBy?.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
            {/* Add  new comment */}
            <div className="flex flex-wrap mt-6 gap-3 items-center">
              <Link
                to={`user-profile/${pinDetail.postedBy?._id}`}
                className='flex gap-2 items-center bg-white rounded-lg'
              >
                <img
                  className='w-8 h-8 rounded-full object-cover'
                  src={pinDetail.postedBy?.image}
                  alt='user-profile'
                />
              </Link>
              <input
                className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button type='button' className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none' onClick={addComment}>
                {addingComment ? 'Posting Comment ...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
        {pins?.length ? (
          <>
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
              More like this
            </h2>
            <MasonryLayout pins={pins} />
          </>
        ) : <Spinner message='Loading more pins' />}
      </div>
    </div>
  )
}

export default PinDetail