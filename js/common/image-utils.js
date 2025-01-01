// image-utils.js

const imageMap = new Map();

export function encodeImageBytes(byteString) {
    const base64 = btoa(byteString);
    const base64url = base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    
    return base64url.slice(0, 15);
}

export function storeImage(key) {
    const shortKey = encodeImageBytes(key);
     imageMap.set('1234', key);
     console.log(imageMap);
    return shortKey;
}

export function getImageMap() {
    return imageMap;
}

export function getOriginalImage(key){
    const orignalKey = imageMap.get(key);
    return orignalKey;
}