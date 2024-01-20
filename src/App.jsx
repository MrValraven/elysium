import { useEffect, useState } from 'react'
import './App.css'

import poemData from './static/poem.json';
import jardimAudioFile from './static/jardim.mp3'

import { sleepNow, typeCode, smoothScrollToBottomOfPage } from './utils/utils';

const writeStanzas = async () => {

  for (const stanza of poemData.stanzas) {
    console.log('Current Stanza: ' + stanza);
    for (let i = 0; i < stanza.verses.length; i++) {
      console.log('Current verse: ', stanza.verses[i]);
      for (let j = 0; j < stanza.verses[i].length; j++) {
        console.log('Current part: ', stanza.verses[i][j]);
        await typeCode(`.stanza${stanza.id} .verse${i} .part${j}`, stanza.verses[i][j]);
        smoothScrollToBottomOfPage();
        await sleepNow(poemData.timeBetweenVersePartsInMilliseconds)
      }
      await sleepNow(poemData.timeBetweenStanzasInMilliseconds);
    }
  }
};

let codeOut = 0;

const writePoem = async (delay = 1000) => {
  if (codeOut === 'abracossom') delay = 1500;
  await sleepNow(2000);
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
          {poemData.stanzas.map((stanza, index) =>
            <div className={`stanza${index}`} id={`stanza${index}`} key={stanza.id}>
              {stanza.verses.map(((verse, verseIndex) =>
                <p key={verse + index + verseIndex} className={`verse${verseIndex}`}>
                  {verse.map((versePart, versePartIndex) => <span key={"" + index + verseIndex + versePartIndex} className={`part${versePartIndex}`}></span>)}
                </p>
              ))}
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
