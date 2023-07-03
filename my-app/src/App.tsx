import React, {useState, useMemo} from 'react';
import './App.css';
import {t} from './i18n';

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
      {loggedIn && <LoggedSection />}
      </div>

    </main>
  );
}
export default App;

interface Mp3File extends File {
    /**
     * Duration in seconds
     */
    duration: number;
}

function LoggedSection(){
    // when user select files, read their duration and assign them to each mp3
    const [mp3s, setMp3s] = useState([] as Mp3File[]);
    console.log('mp3s', mp3s)
    const [image, setImage] = useState<File | null>(null)
    const imageSrc = useMemo(() => image && URL.createObjectURL(image), [image]);

    const onFilesChange = (newFiles: File[]) => {
        const newImage = newFiles.findLast(f => ['image/png', 'image/jpeg'].includes(f.type))
        if (newImage) {
            setImage(newImage)
        }
        const newAudioFiles = newFiles.filter(f => f.type === 'audio/mpeg');
        Promise.all(newAudioFiles.map(fileToMp3File))
        .then(newMp3Files => setMp3s(mp3s.concat(newMp3Files)))
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
        <Mp3List mp3s={mp3s} onChange={newMp3s => setMp3s(newMp3s)} />
    </section>
}

interface Mp3ListProps {
    mp3s: Mp3File[],
    onChange: (newFiles: Mp3File[]) => void
}
function Mp3List({mp3s, onChange}: Mp3ListProps) {
    return <div className="mp3List">
        {mp3s.map((mp3, index) => {
            const songName = mp3.name.split('.mp3')[0]!
            return <div className="song" key={index}>
            {songName}{'\t'}
            <span className="song-duration">{mp3.duration}</span>
            </div>
        })}
    </div>
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
