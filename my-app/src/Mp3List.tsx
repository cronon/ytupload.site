import React from 'react';
import { Mp3File } from './App';
import { toTimeCode } from './timeUtils';
import { t } from './i18n';

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
    return <table className="mp3List">
        <tbody>
        {mp3s.map((mp3, index) => {
            return <tr className="song" key={index}>
                <td>{mp3.name}</td>
                <td>{toTimeCode(mp3.duration)}</td>
                <td><button onClick={() => removeSong(index)} title={t('removeSong')}>x</button></td>
            </tr>;
        })}
        </tbody>
    </table>;
}
