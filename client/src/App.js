import React, { useEffect, useState } from 'react';
import './App.css';
import {SearchBar} from './searchBar';
import {Content} from './content';
import axios from 'axios';

function App() {
  const [ search, setSearch] = useState("");
  const [ count, setCount] = useState("");
  async function fetchData(){
    const config_sub = {
      method: 'post',
      url: 'http://localhost:3001/queryCount'
    };
    const num = await axios(config_sub)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
      return ""
    });
    setCount(num)
  }
  // only run once for adding and getting the number of visitor
  useEffect(() => {
    fetchData()
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        {count !== "" &&
          <h3>count : {count}</h3>
        }
        <SearchBar 
        onSubmit = {setSearch}  
        onClear = {setSearch}
        />
        {search !== "" &&
          <Content 
          search = {search}
          />
        }
      </header>
    </div>
  );
}
export default App;
