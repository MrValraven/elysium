import { useEffect, useState } from 'react'
import './App.css'

import poemData from './static/poem.json';
import jardimAudioFile from './static/jardim.mp3'

import { sleepNow, typeCode, typeAllCode, smoothScrollToBottomOfPage } from './utils/utils';

const DEFAULT_AUDIO_VALUES = {
  WRITTING_SPEED: 30,
  PAUSE_BEFORE_NEXT_STANZA: 1200
}

const writeStanzas = async () => {

  for (const stanza of poemData.stanzas) {
    for (let i = 0; i < 4; i++) {
      await typeCode(`.stanza${stanza.id} .verse${i + 1}`, stanza.verses[i]);
      smoothScrollToBottomOfPage();
      await sleepNow(1500);
    }
  }
};

let codeOut = 0;

const writePoem = async (delay = 1000) => {
  if (codeOut === 'abracossom') delay = 2000;
  await sleepNow(1000);
  await typeCode('.poemTitle', poemData.title, 100);
  await sleepNow(delay);
  await writeStanzas();
  smoothScrollToBottomOfPage();
  await typeCode('.dedication', poemData.dedication);
  smoothScrollToBottomOfPage();
  await typeCode('.signature', poemData.signature);
  smoothScrollToBottomOfPage();
}

function App() {
  const [audioFile, setAudioFile] = useState(new Audio(jardimAudioFile))
  const [poem, setPoem] = useState({
    title: "",
    stanzas: [],
    dedication: "",
    signature: "",
  })

  const [showPoem, setShowPoem] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.input.value) return;

    console.log(code);
    console.log(e.target.input.value)

    codeOut = code;

    if (code === 'abracos') {
      setShowPoem(true);
      return;
    }

    else if (code === 'abracossom') {
      setShowPoem(true);
      audioFile.play();
      return;
    }

    setShowErrorMessage(true);
  }

  useEffect(() => {
    setPoem(poemData);
  }, [])
  useEffect(() => {
    (async () => {
      if (showPoem) {
        await writePoem();
      }
    })();
  }, [showPoem])

  return (
    <>
      {!showPoem ? <div className='start'>
        <h1 className='appName'>Elysium</h1>
        <h4 className='appSlogan'>Where words dance and hearts sing</h4>
        <form className='form-container' onSubmit={handleSubmit}>
          <label htmlFor="">Code:</label>
          <input id="input" placeholder='Ex: a cool code' type="text" value={code} onChange={(e) => { setCode(e.target.value); setShowErrorMessage(false) }} />
          <p className={`${showErrorMessage ? "hasError" : ""}`}>Unfortunately no poems correspond to that code :(</p>
          <button>Submit</button>
        </form>
      </div>
        : <div className="poem">
          <h1 className='poemTitle'>{ }</h1>
          {poemData.stanzas.map((stanza, index) => <div className={`stanza${index + 1}`} id={`stanza${index + 1}`} key={stanza.id}>
            <p className='verse1'>{ }</p>
            <p className='verse2'>{ }</p>
            <p className='verse3'>{ }</p>
            <p className='verse4'>{ }</p>
          </div>)
          }
          <div>
            <p className='dedication'></p>
            <p className='signature'></p>
          </div>
        </div>}
    </>
  )
}

export default App
