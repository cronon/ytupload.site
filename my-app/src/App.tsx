import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

//

function App() {
const [loggedIn, setLoggedIn] = useState(false)

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
    const [files, setFiles] = useState([1]);
    const hasFiles = !!files.length
    const cl = 'select-files ' + (hasFiles ? '' : 'select-files-expanded');
    return <section>
        <h2>Welcome @username</h2>
        <div className={cl}>
            <input type="file" />
        </div>
        {hasFiles && <EditSection />}
    </section>
}
function EditSection(){
    const files = [
        {filename: 'artist-title.mp3', name: 'artist-title', length: 290},
        {filename: 'artist-title2.mp3', name: 'artist-title2', length: 350}
    ]
    return <div className="edit-section">
        <div className="playlist">
            {files.map(f => {
                return <div>{f.name} {f.length} 3:57</div>
            })}
        </div>
        <div className="cover">
            <img src="https://storage.googleapis.com/pai-images/0af0bd5b3c414f04bb5ba9173d637577.jpeg" />
        </div>
        <div className="album-upload">
            <div className="album-edit">
                <input type="text" />
                <textarea />
            </div>
            <div className="album-preview">
                {files.map(f => {
                return <div>{f.name} {f.length} 3:57</div>
                })}
            </div>
        </div>
    </div>
}

/**
login with youtube button
drag-n-drop files. After drag-n-drop show the edit section
add more files

if one file then only edit song section
if many files then uploadAlbum
*/
