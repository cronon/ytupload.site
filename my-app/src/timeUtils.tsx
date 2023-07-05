type Timecode = string;
export function toTimeCode(duration: number): Timecode {
    const rounded = Math.round(duration);
    const [s, extraM] = splitTimeUnit(rounded);
    const [m, extraH] = splitTimeUnit(extraM);
    const h = extraH;

    const ss = tt(s), mm = tt(m), hh = tt(h);
    return [hh, mm, ss].join(':');
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
export function noZeroHH(timestamp: string) {
    if (timestamp.length === 5) return timestamp;
    else if (timestamp.length === 8) {
        if (timestamp[0] === '0' && timestamp[1] === '0') return timestamp.slice(3);
        else return timestamp;
    }
    else throw new Error(`Cannot remove leading zeros from a time ${timestamp}`);
}
