import React, {useState, useMemo} from 'react';
import './App.css';
import {t} from './i18n';
import { Mp3List } from './Mp3List';
import { last, zip } from 'lodash';
import { noZeroHH, toTimeCode } from './timeUtils';

function App() {
const [loggedIn, setLoggedIn] = useState(true)

  return (
    <main>
      <header className="App-header">
        <h1>YtUpload</h1>
      </header>
      <div className="login-button">
      {!loggedIn &&
          <button onClick={() => setLoggedIn(true)}>Login with Youtube</button>
      }
      </div>
      {loggedIn && <LoggedSection />}

    </main>
  );
}
export default App;

export interface Mp3File extends File {
    /**
     * Duration in seconds
     */
    duration: number;
}

function LoggedSection(){
    // when user select files, read their duration and assign them to each mp3
    const [mp3s, setMp3s] = useState([] as Mp3File[]);
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const imageSrc = useMemo(() => image && URL.createObjectURL(image), [image]);

    const onFilesChange = async (newFiles: File[]) => {
        const newImage = newFiles.findLast(f => ['image/png', 'image/jpeg'].includes(f.type))
        if (newImage) {
            setImage(newImage)
        }
        setLoading(true)
        const newAudioFiles = newFiles.filter(f => f.type === 'audio/mpeg');
        const newMp3Files = await Promise.all(newAudioFiles.map(fileToMp3File))
        setLoading(false)
        setMp3s(mp3s.concat(newMp3Files))
    }
    return <section>
        {/*<h2>Welcome @username</h2>*/}
        <a href="../index.html">Back to the Home page</a>
        <p>Pick mp3 and cover image files:</p>
        <div className="select-files">
            <input type="file" multiple accept="audio/mp3" onChange={(e) => e.target.files && onFilesChange(Array.from(e.target.files))}/>
            {/*<input type="file" multiple accept="image/png, image/jpeg, audio/mp3" onChange={(e) => e.target.files && onFilesChange(Array.from(e.target.files))}/>*/}
        </div>
{/*        {image && <img className="album-cover" src={imageSrc!} alt={t('img.albumCover')} />}
        <pre>
            {image && `image ${image.name}\n`}
        </pre>*/}
        {loading && <div className="loading-indicator">Reading files...</div>}
        <p>Mp3 files:</p>
        <Mp3List mp3s={mp3s} onChange={newMp3s => setMp3s(newMp3s)} />
        <p>Timecodes:</p>
        <Timecodes mp3s={mp3s}/>
    </section>
}


function Timecodes({mp3s}: {mp3s: Mp3File[]}) {
    const durations = mp3s.reduce((prevDurations, mp3) => {
        const prevDuration = last(prevDurations)
        if (prevDuration !== undefined) {
            return prevDurations.concat(prevDuration + mp3.duration)
        } else {
            return [0]
        }
    }, [] as number[])
    const songs = zip(durations, mp3s) as [number, Mp3File][];
    return <pre className="timecodes">
        {songs.map(song => {
            const songName = song[1].name.split('.mp3')[0]!;
            return noZeroHH(toTimeCode(song[0])) + ' ' + songName + '\n'
        })}
    </pre>
}


/**
 * Mutates File object
 */
async function fileToMp3File(file: File): Promise<Mp3File> {
    const duration = await getDuration(file);
    (file as any).duration = duration;
    return file as Mp3File;
}
async function getDuration(file: File): Promise<number> {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = (e) => {
            const ctx = new AudioContext();
            const audioArrayBuffer = e.target!.result as ArrayBuffer;
            ctx.decodeAudioData(audioArrayBuffer, data => {
                // this is the success callback
                const duration = data.duration;
                res(duration);
            }, error => {
                // this is the error callback
                rej(error)
            });
        };
    })
};
