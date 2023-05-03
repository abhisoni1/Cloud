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

  function getAudioUrl(text, translatedText, voice, recordId){

    setIsLoading(true);

    const data = {
      "recordId" : recordId
    }

    const api = 'https://5b7br1vxj6.execute-api.us-east-1.amazonaws.com/v1';

    axios
      .post(api, data)
      .then((response) => {

        const url = response.data.body;

        const row = [
          {
            "url" : url,
            "text" : text,
            "translatedText" : translatedText,
            "voice" : voice,
            "recordId" : recordId
          }
        ]

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

      console.log(body);

      getAudioUrl(body.inputText, body.TranslatedText, body.voice, body.recordId);

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
    <div className="main">

      <div className='sub-main'>
        <div className='subsubmain'>
          <div>
            <div>
              <h1>Smart Text to Audio Converter</h1>
            </div>
            <div className='inputArea'>
              <form id="inputForm" onSubmit={convertToAudio}>
        
                <div className='textareaInput'>
                  <textarea id="inputText" placeholder='Input Text' className='inputData' name="text" rows="5" cols="50" onChange={(e) => setInputText(e.target.value) }/>
                </div>

                <div className='selectInput'>
                  <select id="voice" className='inputData' name="voices" onChange={(e) => setVoice(e.target.value)} defaultValue="choose">
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
                </div>
                
                <div className='submitButton'>
                  <button type="submit" disabled={ (inputText.trim() !== '' && voice.trim() !== '') ? false : true}>Convert to Audio</button>
                </div>

              </form>

            </div>
              {/* <hr></hr> */}
            <div>
              {/* {isLoading ? <LoadingSpinner /> : renderTable} */}
              { isLoading ? <LoadingSpinner /> :
                <div>
                  { tableRows.length > 0 ? renderTable : <></>} 
                </div>
              }
            </div>
          </div>
        </div>

        
      </div>
      
      
    </div>
  </>
  
}
