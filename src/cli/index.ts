import chalk from "chalk";
import { Command } from "commander";
import dotenv from "dotenv";
import { Network } from "../network";

interface CliOptions {
  verbose?: boolean;
  prompt?: string;
  env?: string;
}

interface StartCliOptions {
  prompt: string;
  verbose: boolean;
  envFilePath: string;
  turns?: number;
}

export class Cli {
  private static instance: Cli;
  private static DEFAULT_VERBOSE = false;
  private options: CliOptions;
  private verbose: boolean;
  private program: Command;
  private commandMap: Map<string, Function> = new Map();
  private DEFAULT_TURNS = 10;

  private constructor(options?: CliOptions) {
    this.options = options || {
      verbose: Cli.DEFAULT_VERBOSE,
      prompt: "",
      env: "",
    };
    this.verbose = this.options.verbose ?? Cli.DEFAULT_VERBOSE;
    this.program = new Command();

    if (this.verbose) {
      console.log(chalk.cyanBright("Cli instance created."));
    }

    this.initProgram();
    this.loadEnv();
    this.initCommandMap();
  }

  private loadEnv() {
    if (this.options.env) {
      this.loadDotenvFromPath();
    } else {
      this.loadDotenvDefault();
    }
  }

  private loadDotenvFromPath() {
    dotenv.config({ path: this.options.env, override: true });
    if (this.verbose) {
      console.log(
        chalk.green(`Environment variables loaded from ${this.options.env}.`)
      );
    }
  }

  private loadDotenvDefault() {
    const dotenvLoadResult = dotenv.config({
      override: true,
      path: ".env",
    });

    if (dotenvLoadResult.error) {
      console.log(
        chalk.red(
          `Failed to load environment variables from .env: ${dotenvLoadResult.error}`
        )
      );
      console.log(
        chalk.red(
          "Either add a .env file from the folder where you're running the program or pass the path to the file using the --env flag."
        )
      );
      this.program.help();
    } else if (!dotenvLoadResult.error && this.verbose) {
      console.log(chalk.green("Environment variables loaded from .env"));
    }
  }

  private initProgram() {
    this.program
      .option("--start", "Start the simulation")
      .option("--prompt <prompt>", "Initial prompt to start the system")
      .option("--verbose", "Enable verbosity")
      .option("--env <path>", "Path to the env file with API keys")
      .option(
        "--turns <number>",
        "Number of turns for the simulation",
        String(this.DEFAULT_TURNS)
      )
      .parse(process.argv);
  }

  private initCommandMap() {
    this.commandMap.set("start", this.start.bind(this));

    this.commandMap.set("undefined", () => {
      console.log(chalk.red("Invalid command."));
      this.program.help();
    });
  }

  private async start(options: StartCliOptions) {
    // NOTE: this should be replaced by a custom validator or a validator chain
    if (!options.prompt) {
      console.log(chalk.red("Prompt is required to start the simulation."));
      return;
    }

    console.log(chalk.green("Starting the simulation!"));

    const network = await Network.fromPrompt(options.prompt, options.verbose);

    if (!network) {
      console.log(chalk.red("Failed to create the network."));
      return;
    }

    await network.start({ turns: options.turns });
  }

  public static getInstance(options?: CliOptions): Cli {
    if (!Cli.instance) {
      Cli.instance = new Cli(options);
    }
    return Cli.instance;
  }

  public async run() {
    const options = this.program.opts();
    this.options = options;

    const command = options.start ? "start" : "undefined";

    // NOTE: this is not the most elegant way to handle this, but it works for now
    if (this.commandMap.has(command)) {
      await this.commandMap.get(command)?.({
        prompt: options.prompt,
        verbose: options.verbose,
        envFilePath: options.env,
        turns: options.turns ?? this.DEFAULT_TURNS,
      });
    } else {
      console.log(chalk.red("Invalid command."));
      this.program.help();
    }
  }
}
