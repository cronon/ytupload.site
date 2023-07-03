import React, {useState} from 'react';
import './App.css';

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

function LoggedSection(){
    const [mp3s, setMp3s] = useState([] as File[]);
    const [image, setImage] = useState<File | null>(null)

    const onFilesChange = (newFiles: File[]) => {
        const newImage = newFiles.findLast(f => ['image/png', 'image/jpeg'].includes(f.type))
        if (newImage) {
            setImage(newImage)
        }
        const newAudio = newFiles.filter(f => f.type === 'audio/mpeg')
        setMp3s(mp3s.concat(newAudio))
    }
    return <section>
        <h2>Welcome @username</h2>
        <div className="select-files">
            <input type="file" multiple accept="image/png, image/jpeg, audio/mp3" onChange={(e) => e.target.files && onFilesChange(Array.from(e.target.files))}/>
        </div>
        <pre>
            {image && `image ${image.name}\n`}
            {mp3s.map(mp3 => mp3.name + '\n')}
        </pre>
    </section>
}
