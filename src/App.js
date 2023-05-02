import { useEffect, useState } from 'react';
import './App.css';

import axios from 'axios';
import VoicesTable from './table';
import LoadingSpinner from "./loader"

export default function App (){

  const [maleVoices, setMaleVoices ] = useState([]);
  const [femaleVoices, setFemaleVoices ] = useState([]);

  const [inputText, setInputText] = useState('');
  const [ voice, setVoice ] = useState('');

  const [ tableRows, setTableRows ] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const api = 'https://r3jrsnowsb.execute-api.us-east-1.amazonaws.com/v1';
    const data = {
            "Gender": "Male",
            "Language": "en-US"
          };
    axios
      .post(api, data)
      .then((response) => {
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

    // console.log(text, voice, recordId);

    setIsLoading(true);

    const data = {
      "recordId" : recordId
    }

    const api = 'https://5b7br1vxj6.execute-api.us-east-1.amazonaws.com/v1';

    axios
      .post(api, data)
      .then((response) => {
        // console.log(response);

        const url = response.data.body;

        const row = [
          {
            "url" : url,
            "text" : text,
            "voice" : voice,
            "recordId" : recordId
          }
        ]

        console.log(row)
        
        setTimeout(() => {
          setTableRows(row);
          setIsLoading(false);

        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  function convertToAudio(event){

    event.preventDefault();


    const data = {
      "voice" : voice,
      "text" : inputText
    }

    const api = 'https://s3ewmg6nh8.execute-api.us-east-1.amazonaws.com/v2';

    axios
    .post(api, data)
    .then((response) => {

      const body = response.data.body;

      getAudioUrl(body.text, body.voice, body.recordId);

      

    })
    .catch((error) => {
      console.log(error);
    });

  }

  const renderTable = (
    <div className='outputarea'>
      <VoicesTable tableRows={tableRows}/>
    </div>
  );

  return <>
    <div className="wrapper">
      <h1>Smart Text to Audio Converter</h1>

      <div className='inputarea'>
        <form onSubmit={convertToAudio}>
      
          <label htmlFor="inputText">Input Text : </label><br></br>
          <textarea id="inputText" name="text" rows="4" cols="50" onChange={(e) => setInputText(e.target.value) }/>

          <br></br>
          <br></br>

          <label htmlFor="voice">Choose a voice : </label>

          <select name="voices" id="voice" onChange={(e) => setVoice(e.target.value)} defaultValue="choose">
            <option value="choose" disabled>
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
        
          <button type="submit" disabled={ (inputText.trim() !== '' && voice.trim() !== '') ? false : true}>Convert to Audio</button>

        </form>
      </div>
      
      <hr></hr>

      {/* <div className='outputarea'>
        <VoicesTable tableRows={tableRows}/>
      </div> */}

      {isLoading ? <LoadingSpinner /> : renderTable}
    </div>
  </>
  
}
