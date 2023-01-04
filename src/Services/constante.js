const dev_ip = "192.168.34.163";

const link = typeof dev_ip !== "undefined" ? dev_ip : "api.beta.trenderapp.com";
const s = link === "api.beta.trenderapp.com" ? "s" : "";
const port = link === "api.beta.trenderapp.com" ? "" : ":4000";

export const apibaseurl = `http${s}://${link}${port}/api`;
export const cdnbaseurl = "https://cdn.trenderapp.com";
export const websiteurl = "https://trenderapp.com";
export const websocketurl = `ws${s}://${link}${port}`;
export const captchasiteKey = "6c5b583c-f335-4af1-ba18-d6cf3c5814ca";
export const posturl = `${websiteurl}/trends`;