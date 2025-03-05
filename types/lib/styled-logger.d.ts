import chalk from "chalk";
export declare class StyledLogger {
    static log(message: string, style?: chalk.Chalk, verbose?: boolean, ...args: any[]): void;
    static logError(message: string, style?: chalk.Chalk, verbose?: boolean, ...args: any[]): void;
}
