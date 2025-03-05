import chalk from "chalk";

export class StyledLogger {
  public static log(
    message: string,
    style: chalk.Chalk = chalk.white,
    verbose = false,
    ...args: any[]
  ): void {
    if (verbose) {
      console.log(style(`[Network] ${message}`), ...args);
    }
  }

  public static logError(
    message: string,
    style: chalk.Chalk = chalk.red,
    verbose = false,
    ...args: any[]
  ): void {
    if (verbose) {
      console.error(style(`[Network] ${message}`), ...args);
    }
  }
}
