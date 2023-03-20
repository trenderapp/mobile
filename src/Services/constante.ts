const dev_ip = undefined;

const link = typeof dev_ip !== "undefined" ? dev_ip : "api.trenderapp.com";
const s = link === "api.trenderapp.com" ? "s" : "";
const port = link === "api.trenderapp.com" ? "" : ":4001";

export const apibaseurl = `http${s}://${link}${port}/api/v2`;
export const cdnbaseurl = `https://cdn.trenderapp.com${dev_ip ? "/test" : ""}`;
export const websiteurl = "https://trenderapp.com";
export const websocketurl = `ws${s}://${link}${port}/api/v2`;
export const captchasiteKey = "6c5b583c-f335-4af1-ba18-d6cf3c5814ca";
export const posturl = `${websiteurl}/trends`;

export const strip_public_key="pk_live_51MgmhMIjDzZnrQfFN0QFCPcbXetzt6u8nwmjAWfW9n8qZoonDe1U6fXhFTxIe8asAm1pehZjBAifxp9aYpvdbZ2d00PuNMWR5o";