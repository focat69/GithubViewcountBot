/*
 * proxyGen.ts
 * Author: @focat69 on GitHub
 * Date: 2024-08-15 (YYYY-MM-DD)
 */

//-- Imports
import axios from 'axios';
import * as fs from 'fs';
import * as os from 'os';
import * as child_process from 'child_process';
import { Logger, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, RESET } from './logger';

//-- Constants
const apiUrl = "https://proxylist.geonode.com/api/proxy-list?protocols=http&limit=500&page=1&sort_by=lastChecked&sort_type=desc";
const logger = new Logger();
const outputFilePath = "proxies.txt";

//-- Functions
async function fetchProxies() {
    try {
        const response = await axios.get(apiUrl);
        return response.data.data || [];
    } catch (error: any) {
        logger.error(`Failed to fetch proxies: ${error.message}`);
        return [];
    }
}

function isProxyOnline(ip: string): boolean {
    const response = os.platform() === 'win32' 
        ? child_process.spawnSync('ping', ['-n', '1', ip], { stdio: 'ignore' }).status 
        : child_process.spawnSync('ping', ['-c', '1', ip], { stdio: 'ignore' }).status;
    return response === 0;
}

async function saveProxiesToFile(proxies: any[]) {
    const fileStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

    for (const proxy of proxies) {
        const ip = proxy.ip;
        const port = proxy.port;
        if (ip && port) {
            if (isProxyOnline(ip)) {
                logger.log(`${RED}[+]${RESET} The proxy IP is online${CYAN} ${ip}:${port} ${RESET}`);
                fileStream.write(`${ip}:${port}\n`);
            } else {
                logger.log(`${RED}[-]${RESET} This proxy IP didn't respond${CYAN} ${ip}:${port} ${RESET}`);
            }
        }
    }

    fileStream.end();
}

//-- Main
var done: boolean = false;
async function runProxies() {
    logger.info('Fetching proxies...');
    const proxies = await fetchProxies();
    logger.info(`Fetched ${proxies.length} proxies.`);
    await saveProxiesToFile(proxies);
    logger.info('Proxies saved to file.');

    done = true;
}

//-- Exports
export {
    runProxies,
    done
};