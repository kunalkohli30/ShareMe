import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import sanityClient from "../../client";
import { feedQuery, searchQuery } from '../utils/data';

const Feed = () => {

  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    console.log('category id', categoryId);
    if (categoryId) {
      const query = searchQuery(categoryId);

      sanityClient.fetch(query)
        .then(data => {
          console.log('category wise pins', data);
          setPins(data);
          setLoading(false);
        })
    } else {
      sanityClient.fetch(feedQuery)
        .then(data => {

          setPins(data);
          setLoading(false);
        })
    }
  }, [categoryId])

  if (loading) return <Spinner message='We are adding new ideas to your feed!' />
  if(!pins?.length) return <h2 className='text-center text-2xl bg-slate-500 text-white'>No pins available</h2>
  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed