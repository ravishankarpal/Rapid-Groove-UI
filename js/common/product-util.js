export function encodeProductId(productId) {
    const base64Encoded = btoa(productId.toString()); 
    const randomPadding = Math.random().toString(36).substring(2, 12); 
    return btoa(base64Encoded + randomPadding); 
}