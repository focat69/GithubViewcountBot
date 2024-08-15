/* 
 * logger.ts
 * @focat69
 * 2024-08-15 (YYYY-MM-DD)
 * Pretty, small, and simple logger
*/

//-- CONSTANTS
const RESET   = '\x1b[0m';
const RED     = '\x1b[31m';
const GREEN   = '\x1b[32m';
const YELLOW  = '\x1b[33m';
const BLUE    = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN    = '\x1b[36m';
const WHITE   = '\x1b[37m';

//-- Class
class Logger {
    getTimestamp() {
        /*
         * Get the current timestamp in a log-friendly format
         */
        const date = new Date();
        return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`;
    }

    log(message: string) {
        /*
         * message: The message to log
         */
        console.log(`${this.getTimestamp()} [${WHITE}LOG${RESET}] ${message}`);
    }
    info(message: string) {
        /*
         * message: The message to inform
         */
        console.log(`${this.getTimestamp()} [${BLUE}INFO${RESET}] ${message}`);
    }
    warn(message: string) {
        /*
         * message: The message to warn
         */
        console.log(`${this.getTimestamp()} [${YELLOW}WARN${RESET}] ${message}`);
    }
    error(message: string) {
        /*
         * message: The error message
         */
        console.log(`${this.getTimestamp()} [${RED}ERROR${RESET}] ${message}`);
    }
    success(message: string) {
        /*
         * message: The success message
         */
        console.log(`${this.getTimestamp()} [${GREEN}SUCCESS${RESET}] ${message}`);
    }
}

//-- Exports
export {
    Logger,

    // * Colors
    RED,
    GREEN,
    YELLOW,
    BLUE,
    MAGENTA,
    CYAN,
    WHITE,
    RESET
};