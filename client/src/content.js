import React, { useState, useEffect } from 'react';
import axios from 'axios';

async function grabBooks(query){
    const data = JSON.stringify({
      "search": query
    });
    const config = {
      method: 'post',
      url: 'http://localhost:3001/books',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const res = await axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
      return null
    });
    return res;
  }

export function Content({search,onFinish}){
  const [ data, setData ] = useState(null);
  const [ pageLoading, setPageLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  useEffect(()=>{
    setPageLoading(true);
    async function grabData(){
        try
        {
            let books = await grabBooks(search);
            if(books === null){
                setError(true)
            }
            setData(books);
            setPageLoading(false);
        }
        catch(err)
        {
            console.log(err);
            setError(true);
            setPageLoading(false);
        }}
    grabData();
  },[search])
  if(pageLoading){
    return <p> Words are loading </p>
  }
  if(error){
    return <p> There is a error </p>
  }
  return(
    <div>
        <p>{JSON.stringify(data)}</p>
    </div>
  )
    
}
