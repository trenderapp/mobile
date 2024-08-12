import Config from "react-native-config";

export const environment = Config?.ENV ?? "production";

export const apibaseurl = Config?.API_BASE_URL ?? "https://api.trenderapp.com/v6";
export const cdnbaseurl = Config?.CDN_BASE_URL ?? "https://cdn.trenderapp.com";
export const websiteurl = Config?.WEBSITE_BASE_URL ?? "https://trenderapp.com";
export const websocketurl = Config?.WEBSOCKET_URL ?? "wss://api.trenderapp.com/v6";
export const posturl = Config?.POST_URL ?? "https://trenderapp.com/trends";

export const captchasiteKey = Config?.CAPTCHA_SITE_KEY ?? "6c5b583c-f335-4af1-ba18-d6cf3c5814ca";
export const strip_public_key= Config?.STRIPE_PUBLIC_KEY ?? "pk_live_51MgmhMIjDzZnrQfFN0QFCPcbXetzt6u8nwmjAWfW9n8qZoonDe1U6fXhFTxIe8asAm1pehZjBAifxp9aYpvdbZ2d00PuNMWR5o";
