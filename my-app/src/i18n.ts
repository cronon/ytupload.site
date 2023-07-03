const i18n = {
    "img.albumCover": "Album cover"
} as const
type I18nKey = keyof typeof i18n;

export function t(key: I18nKey): string {
    if (i18n[key]) return i18n[key]
    else return key;
}
