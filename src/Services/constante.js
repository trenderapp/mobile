const dev_ip = undefined;

const link = typeof dev_ip !== "undefined" ? dev_ip : "api.trenderapp.com";
const s = link === "api.trenderapp.com" ? "s" : "";
const port = link === "api.trenderapp.com" ? "" : ":4000";

export const apibaseurl = `http${s}://${link}${port}/api`;
export const cdnbaseurl = `https://cdn.trenderapp.com${dev_ip ? "/test" : ""}`;
export const websiteurl = "https://trenderapp.com";
export const websocketurl = `ws${s}://${link}${port}`;
export const captchasiteKey = "6c5b583c-f335-4af1-ba18-d6cf3c5814ca";
export const posturl = `${websiteurl}/trends`;