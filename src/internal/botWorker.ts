/*
 * botWorker.ts
 * @focat69
 * Date: 2024-08-15 (YYYY-MM-DD)
 * Worker thread to send views to a URL
 */

//-- Imports
import { parentPort, workerData } from 'worker_threads';
import { sendView, sharedBuffer } from './botViews';

//-- Variables
const { viewURL, timeout, proxies } = workerData;
const viewCountArray = new Int32Array(sharedBuffer);

//-- Functions
function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
}

function sendViewAndUpdate() {
    const proxy = getRandomProxy();
    sendView(viewURL, proxy).then(() => {
        parentPort?.postMessage(`1 View count: ${Atomics.load(viewCountArray, 0)}`);
    }).catch((error: any) => {
        parentPort?.postMessage(`2 Failed to send view. Error: ${error.message}`);
    });
}

//-- Main
function main() {
    setInterval(sendViewAndUpdate, timeout);
}

//-- Run worker
main();