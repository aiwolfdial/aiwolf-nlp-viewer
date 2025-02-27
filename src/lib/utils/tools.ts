import CryptoJS from "crypto-js";


const usedIndexes = new Map<string, Map<string, number>>();

export function hashToIndex(id: string, text: string, size: number): number {
    if (!usedIndexes.has(id)) {
        usedIndexes.set(id, new Map<string, number>());
    }
    const map = usedIndexes.get(id);
    if (map && map.has(text)) {
        return map.get(text)!;
    }
    const hash = CryptoJS.MD5(text).toString();
    const num = BigInt("0x" + hash);
    const index = Number(num % BigInt(size));
    for (let i = 0; i < size; i++) {
        const idx = (index + i) % size;
        if (!map || !map.has(idx.toString())) {
            if (map) {
                map.set(text, idx);
            }
            return idx;
        }
    }
    return Number(num % BigInt(size));
}