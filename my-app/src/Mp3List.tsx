import React from 'react';
import { Mp3File } from './App';

interface Mp3ListProps {
    mp3s: Mp3File[];
    onChange: (newFiles: Mp3File[]) => void;
}
export function Mp3List({ mp3s, onChange }: Mp3ListProps) {
    const removeSong = (index: number) => {
        const toRemove = [...mp3s];
        toRemove.splice(index, 1);
        onChange(toRemove);
    };
    return <div className="mp3List">
        {mp3s.map((mp3, index) => {
            const songName = mp3.name.split('.mp3')[0]!;
            return <div className="song" key={index}>
                {songName}{'\t'}
                <span className="song-duration">{mp3.duration}</span>
                <button onClick={() => removeSong(index)}>x</button>
            </div>;
        })}
    </div>;
}
