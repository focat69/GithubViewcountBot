/*
 * GitHub Viewcount Bot
 * Author: @focat69 on GitHub
 * Date: 2024-08-15 (YYYY-MM-DD)
 */

//-- Imports
process.chdir(__dirname);
import { 
    Logger, 
    RED, GREEN, YELLOW, 
    BLUE, MAGENTA, CYAN,  // prolly should've made the colors into an object or class lol
    WHITE, RESET }    from './internal/logger';
import * as BotViews  from  './internal/botViews';
import {
    runProxies, done
}                     from './internal/proxyGen';
import { Worker }     from  'worker_threads';
import fs             from 'fs';
import path           from 'path';

//-- Constants
const logger: Logger = new Logger();
const banner: string = RED + `
  ________  ___ ___   ____   ____.__                __________        __   
 /  _____/ /   |   \  \   \ /   /|__| ______  _  __ \______   \ _____/  |_ 
/   \  ___/    ~    \  \   Y   / |  |/ __ \ \/ \/ /  |    |  _//  _ \   __\
\    \_\  \    Y    /   \     /  |  \  ___/\     /   |    |   (  <_> )  |  
 \______  /\___|_  /     \___/   |__|\___  >\/\_/    |______  /\____/|__|  
        \/       \/                      \/                 \/             
` + RESET;

//-- Variables
var viewURL       : string;
var timeout       : number;
var workers       : number;
var botRunning    : boolean = false;
var workerThreads : Worker[] = [];
var proxies       : string[] = [];

//-- Functions
function readProxiesFromFile(filePath: string): string[] {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }
    catch (error: any) {
        logger.error(`Failed to read proxies from file: ${error.message}`);
        return [];
    }
}

function startBot() {
    /*
     * Start the view bot via multiple worker threads
     */
    if (botRunning) {
        logger.warn('Bot is already running!');
        return;
    }
    botRunning = true;

    for (let i = 0; i < workers; i++) {
        const worker = new Worker('./internal/botWorker.js', {
            workerData: {
                viewURL: viewURL,
                timeout: timeout,
                sharedBuffer: BotViews.sharedBuffer,
                proxies: proxies
            }
        });

        worker.on('message', (message: string) => {
            // Get code from first number in message
            const code = parseInt(message.split(' ')[0]); // [1, ...]
            const msg = message.substring(2); // 1 ... -> ...
            switch (code) {
                case 1:
                    logger.success(msg);
                    break;
                case 2:
                    logger.warn(msg);
                    break;
                case 3:
                    logger.info(msg);
                    break;
                case 4:
                    logger.log(msg);
                    break;
                default:
                    logger.error(msg);
                    break;
            }
        });
        worker.on('error', (error: Error) => {
            logger.error(error.message);
        });
        worker.on('exit', (code: number) => {
            logger.warn(`Worker exited with code ${code}`);
            workerThreads = workerThreads.filter(w => w !== worker);
            if (workerThreads.length === 0) {
                botRunning = false;
                logger.warn('All workers have exited.');
            }
        });

        workerThreads.push(worker);
    }
}

function stopBot() {
    /*
     * Stop the view bot
     */
    if (!botRunning) {
        logger.warn('Bot is not running!');
        return;
    }
    botRunning = false;

    workerThreads.forEach(worker => worker.terminate());
    workerThreads = [];
}

//-- Main
function main() {
    logger.log(banner);
    logger.info('Welcome to the GitHub Viewcount Bot!');
    logger.info('Type "help" for a list of commands.');

    process.stdin.on('data', async (data: Buffer) => {
        const input: string = data.toString().trim();
        if (input === 'help') {
            logger.info(`Commands:
- start <url> <workers> [proxiesFilePath] [timeout: 0] : Start the view bot
- stop : Stop the view bot`);
        }
        else if (input.startsWith('start')) {
            const args: string[] = input.split(' ');
            if (args.length < 3) {
                logger.error('Invalid number of arguments!');
                return;
            }
            viewURL = args[1];
            workers = parseInt(args[2]);
            var proxiesFilePath = args.length > 3 ? path.resolve(args[3]) : "null";
            timeout = args.length > 4 ? parseInt(args[4]) : 0;

            if (isNaN(workers) || isNaN(timeout)) {
                logger.error('Invalid arguments!');
                return;
            }
            if (workers < 1) {
                logger.error('Number of workers must be at least 1!');
                return;
            }
            if (timeout < 0) {
                logger.error('Timeout must be a positive number!');
                return;
            }

            if (proxiesFilePath === "null") {
                // generate proxies
                logger.warn('No proxies file provided. Generating 500 proxies...');
                
                try {
                    fs.unlinkSync('proxies.txt'); // delete old proxies
                } catch (error) {
                    // ignore
                }

                try {
                    await runProxies();
                    proxiesFilePath = "src/proxies.txt";
                    proxies = readProxiesFromFile(proxiesFilePath);
                    if (proxies.length > 0) {
                        logger.success('Proxies generated successfully!');
                    } else {
                        logger.error('Failed to generate proxies! No proxies will be used.');
                        proxies = [];
                    }
                } catch (error) {
                    logger.error('Failed to generate proxies! No proxies will be used.');
                    proxies = [];
                }
            } else {
                proxies = readProxiesFromFile(proxiesFilePath);
            }

            startBot();
        }
        else if (input === 'stop') {
            stopBot();
        }
        else {
            logger.error('Invalid command!');
        }
    });

    process.stdin.resume();
}

//-- Run
main();