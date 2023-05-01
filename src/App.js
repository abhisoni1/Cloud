import { Component, useEffect, useState } from 'react';
import './App.css';

import axios from 'axios';
import VoicesTable from './table';

export default function App (){

  const [maleVoices, setMaleVoices ] = useState([]);
  const [femaleVoices, setFemaleVoices ] = useState([]);

  const [inputText, setInputText] = useState('');
  const [ voice, setVoice ] = useState('');

  const [ tableRows, setTableRows ] = useState([]);


  useEffect(() => {
    const api = 'https://r3jrsnowsb.execute-api.us-east-1.amazonaws.com/v1';
    const data = {
            "Gender": "Male",
            "Language": "en-US"
          };
    axios
      .post(api, data)
      .then((response) => {
        // console.log(response);
        // console.log(response.data.maleVoices);
        // console.log(response.data.femaleVoices);
        setMaleVoices(response.data.maleVoices);
        setFemaleVoices(response.data.femaleVoices);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])
    

  function getMaleVoices(){

    return maleVoices.map((voice) => {
      return <option value={voice}>{voice} </option>;
    })
  
  }

  function getFemaleVoices(){

    return femaleVoices.map((voice) => {
      return <option value={voice}>{voice} </option>;
    })
  
  }

  function getAudioUrl(text, voice, recordId){

    const data = {
      "recordId" : recordId
    }

    const api = 'https://5b7br1vxj6.execute-api.us-east-1.amazonaws.com/v1';

    axios
      .post(api, data)
      .then((response) => {
        console.log(response);

        const url = response.data.body;

        const row = [
          {
            "url" : url,
            "text" : text,
            "voice" : voice,
            "recordId" : recordId
          }
        ]
  
        
        const tableRows = row;
  
        setTableRows(tableRows);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  function convertToAudio(event){

    event.preventDefault();

    console.log(inputText, voice);

    const data = {
      "voice" : voice,
      "text" : inputText
    }

    const api = 'https://s3ewmg6nh8.execute-api.us-east-1.amazonaws.com/v2';

    axios
    .post(api, data)
    .then((response) => {
      console.log(response);
      console.log(response.data.body)

      const body = response.data.body;

      getAudioUrl(body.text, body.voice, body.recordId);

      

    })
    .catch((error) => {
      console.log(error);
    });

  }

  return (
    <div className="wrapper">
      <h1>Smart Text to Audio Converter</h1>

      <div className='inputarea'>
        <form onSubmit={convertToAudio}>
      
          <label for="inputText">Input Text : </label><br></br>
          <textarea id="inputText" name="text" rows="4" cols="50" onChange={(e) => setInputText(e.target.value) }/>

          <br></br>
          <br></br>

          <label for="voice">Choose a voice : </label>

          <select name="voices" id="voice" onChange={(e) => setVoice(e.target.value)}>
            <option value="choose" disabled selected="selected">
              -- Select voice --
            </option>
            <optgroup label="Male Voices" >
              {getMaleVoices()}
            </optgroup>
            <optgroup label="Female Voices">
              {getFemaleVoices()}
            </optgroup>
          </select>
          

          <br></br>
          <br></br>
        
          <button type="submit">Convert to Audio</button>

        </form>
      </div>
      
      <hr></hr>

      <div className='outputarea'>
        <VoicesTable tableRows={tableRows}/>
      </div>
    </div>
  );
  
}
