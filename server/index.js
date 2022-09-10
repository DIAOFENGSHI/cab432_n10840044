const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = 3001
const axios = require("axios");
const bodyParser = require("body-parser");
const { ddbDocClient } = require( "./ddbDocClient.js");
const { GetCommand,UpdateCommand } = require( "@aws-sdk/lib-dynamodb");

// Serve out any static assets correctly
// app.use(express.static('../client/build'))
app.use(bodyParser.json());
app.use(cors())

// set the number of visitor to persistence service: AWS DynamoDB
// and send back to the frontend 
app.post('/queryCount', async (req, res) => {
  const num_previous = await getItem()
  const num_now = num_previous + 1
  updateItem(JSON.stringify(num_now))
  res.send(JSON.stringify(num_now))
})

// returns a json file to client
app.post('/books', async (req, res) => {
  let response = await integrateAll(req.body.search)
  res.json(response)
  res.end()
})

const getItem = async () => {
  try {
    const params = {
      TableName: "CAB_432_Test",
      Key: {
        "qut-username": "n10840044@qut.edu.au",
      },
    };
    const data = await ddbDocClient.send(new GetCommand(params));
    console.log("Success :", data.Item);
    return parseInt(data.Item.count)
  } catch (err) {
    console.log("Error", err);
  }
};

const updateItem = async (num) => {
  // Set the parameters.
  const params = {
    TableName: "CAB_432_Test",
    Key: {
      "qut-username": "n10840044@qut.edu.au",
    },
    ProjectionExpression: "#count",
    ExpressionAttributeNames: { "#count": "count" },
    UpdateExpression: "set #count = :c",
    ExpressionAttributeValues: {
      ":c": num,
    },
  };
  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("Success - item added or updated", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}; 

// To mash up all API and return a jason code 
async function integrateAll(search){
  let books = await getSimilarBooks(search)
  return Promise.all(await books.map(async (book)=>{
    book.youtube = await getYoutube(book.title)
    book.twitter = await getTwitter(book.authors[0])
    return book
  }))
}

// To get a book by the search from the client && To get similar books using the first author's name(if there are multiple authors)
async function getSimilarBooks(book){
  const key =  `AIzaSyCIyQiVzTj3EE5ccKHtslEUvNfrnwlnSQg`;
  maxResults_self = 1;
  maxResults_similar = 2;

  // get first book info
  const url_name_book = `https://www.googleapis.com/books/v1/volumes?q=${book}&maxResults=${maxResults_self}&key=${key}`;
  const firstBook = await axios.get(url_name_book)
    .then(resp => {
      const title_book = resp.data.items[0].volumeInfo.title
      const authors_book = resp.data.items[0].volumeInfo.authors
      const description_book = resp.data.items[0].volumeInfo.description
      return {
        title : title_book,
        authors : authors_book,
        description : description_book
      }
    }).catch((error) => console.log(error))

  // get similar books by the author of first book
  const url_author_book = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${firstBook.authors[0]}&maxResults=${maxResults_similar}&key=${key}`
  const similarBooks = await axios.get(url_author_book)
    .then(resp => {
      if(resp.data.items === undefined){
        return null
      }
      return resp.data.items.map(item => {
        return {
          title : item.volumeInfo.title,
          authors : item.volumeInfo.authors,
          description : item.volumeInfo.description
          }
        })
      }
    ).catch((error) => console.log(error))
  
  // check if there is the book which has the same name with firstBook, if yes, remove!
  function removeSame(book){
    return book.title != firstBook.title
  }
  let books = []
  // prevent if there is no similar book
  if(similarBooks !== null){
    books = similarBooks.filter(removeSame)
  }
  // add the firstBook to the first position and return 
  books.unshift(firstBook)
  return books;
}

// query by book's title and returns a array, this array includes objects 
async function getYoutube(query){
    //AIzaSyCIyQiVzTj3EE5ccKHtslEUvNfrnwlnSQg
    //AIzaSyCgc6VIglN1UJVzVb3rP_MrxEuVspVw9rA
    const key = `AIzaSyC0PfusUf85gIK2Oi_jpbElNLFL8JItxzk`
    const maxResult = 3
    const url_youtube = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResult}&q=${query}&key=${key}`
    const videos_youtube = await axios.get(url_youtube)
      .then(resp => {
        if(resp.data.items === undefined){
          return null
        }
        return resp.data.items.map((item) => {
          const video = {
            id : item.id.videoId + item.id.playlistId,
            title : item.snippet.title,
            description : item.snippet.description,
            thumbnails : item.snippet.thumbnails.default.url
          }
          // process the situation that sometimes the vedio has playlistId instead of videoId
          video.id = video.id.replace("undefined","")
          return video
        })
      }).catch((error) => console.log(error))
    return videos_youtube;
}

// query by the first author of this book and returns a array, this array includes objects
async function getTwitter(query){

  // post request to get bearer token
  const username = `TnjQfUCHvDs6bsWBxMzIwZmHS`
  const password = `toA0aCvZq1bb7QdjmCJR5jU9PNZgww282634M5CM0yAZasFiU2`
  const url_token = `https://api.twitter.com/oauth2/token?grant_type=client_credentials`
  const token = await axios.post(url_token,{},{
    auth:{
      username: username,
      password: password
    }
  })
  .then(resp => {
    return resp.data.access_token
  }).catch((error) => console.log(error))

  // get request to get data using token
  const url_search_Twitter = `https://api.twitter.com/2/tweets/search/recent?query=Author ${query}&tweet.fields=created_at&expansions=author_id&user.fields=created_at`
  const comments = await axios.get(url_search_Twitter,{
    headers: {'Authorization': 'Bearer '+ token}
  }).then(resp => {
    if(resp.data.data === undefined){
      return null
    }
    return resp.data.data.map(comment => {
      return {
        id : comment.author_id,
        content : comment.text,
        time : comment.created_at.slice(0, 10)
      }
    })
  }).catch((error) => console.log(error))

  return comments
}

// New api routes should be added here.
// It's important for them to be before the `app.use()` call below as that will match all routes.

// Any routes that don't match on our static assets or api should be sent to the React Application
// This allows for the use of things like React Router

// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
