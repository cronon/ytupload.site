import React, {useState, useMemo} from 'react';
import './App.css';
import {t} from './i18n';
import { Mp3List } from './Mp3List';
import { zip } from 'lodash';

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
        <h2>Welcome @username</h2>
        <div className="select-files">
            <input type="file" multiple accept="image/png, image/jpeg, audio/mp3" onChange={(e) => e.target.files && onFilesChange(Array.from(e.target.files))}/>
        </div>
        {image && <img className="album-cover" src={imageSrc!} alt={t('img.albumCover')} />}
        <pre>
            {image && `image ${image.name}\n`}
            {mp3s.map(mp3 => mp3.name + '\n')}
        </pre>
        {loading && <div className="loading-indicator">Reading files...</div>}
        <Mp3List mp3s={mp3s} onChange={newMp3s => setMp3s(newMp3s)} />
        <Timecodes mp3s={mp3s}/>
    </section>
}

type Timecode = string;
export function toTimeCode(duration: number): Timecode  {
    const rounded = Math.round(duration);
    const [s, extraM] = splitTimeUnit(rounded);
    const [m, extraH] = splitTimeUnit(extraM);
    const h = extraH;

    const ss = tt(s), mm = tt(m), hh = tt(h);
    return [hh, mm, ss].join(':')
}

// prepend zero if necessary, turn h into hh
function tt(t: number): string {
    if (t < 10)
        return '0' + t;
    else
        return t.toString();
}

/**
 * 70 returns 10 result, 1 bigger unit
 */
export function splitTimeUnit(t: number): [number, number] {
    const unit = t % 60;
    const nextUnit = Math.floor((t - unit) / 60);
    return [unit, nextUnit];
}
function noZeroHH(timestamp: string) {
    if (timestamp.length === 5) return timestamp
    else if (timestamp.length === 8) {
        if (timestamp[0] === '0' && timestamp[1] === '0') return timestamp.slice(3);
        else return timestamp;
    }
    else throw new Error(`Cannot remove leading zeros from a time ${timestamp}`);
}

function last<T>(array: T[]): T | null {
    if (array.length === 0) return null;
    else return array[array.length-1]
}
function Timecodes({mp3s}: {mp3s: Mp3File[]}) {
    const durations = mp3s.reduce((prevDurations, mp3) => {
        const prevDuration = last(prevDurations)
        if (prevDuration !== null) {
            return prevDurations.concat(prevDuration + mp3.duration)
        } else {
            return [0]
        }
    }, [] as number[])
    const songs = zip(durations, mp3s) as [number, Mp3File][];
    return <pre>
        {songs.map(song => {
            return noZeroHH(toTimeCode(song[0])) + ' ' + song[1]!.name + '\n'
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
