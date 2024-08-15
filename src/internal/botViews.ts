/*
 * botViews.ts
 * @focat69
 * 2024-08-15 (YYYY-MM-DD)
 * Bot your view count on GitHub!
 */

//-- Imports
import * as Request from './sendReq';

//-- Variables
const sharedBuffer   = new SharedArrayBuffer(4); // 4 bytes for an integer
const viewCountArray = new Int32Array(sharedBuffer);
let interval         : NodeJS.Timeout;

//-- Functions
const getViews = () => Atomics.load(viewCountArray, 0);
const setViews = (viewCount: number) => Atomics.store(viewCountArray, 0, viewCount);

function sendView(viewURL: string, proxy?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const options = proxy ? { proxy } : {};
        Request.GET(viewURL, options, (response: any) => {
            try {
                const html = response;
                const titleMatch = html.match(/<title>(.*?)<\/title>/);
                if (titleMatch && titleMatch[1]) {
                    const title = titleMatch[1];
                    // Assuming the title format is "PROFILE VIEWS: 123"
                    const viewCount = parseInt(title.split(' ')[2]);
                    setViews(viewCount);
                    resolve();
                } else {
                    reject(new Error("Title not found in HTML"));
                }
            } catch (error) {
                reject(error);
            }
        });
    });
}

function startViewBot(viewURL: string, timeout: number, proxy?: string) {
    /*
     * viewURL: The URL of the view counter
     * timeout: The time between each view (in milliseconds)
     * proxy: Optional proxy URL
     */
    interval = setInterval(() => {
        sendView(viewURL, proxy).then(() => {
            console.log(`View count: ${getViews()}`);
        }).catch((error: any) => {
            console.error(error);
        });
    }, timeout);
}

function stopViewBot() {
    /*
     * Stops the view bot
     */
    clearInterval(interval);
}

//-- Exports
export {
    // * Start/stop the bot
    startViewBot,
    stopViewBot,

    // * Keep track of view count
    getViews,
    setViews,

    // * Send a view
    sendView,

    // * Shared buffer
    sharedBuffer
};