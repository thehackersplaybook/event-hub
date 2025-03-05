import { Cli } from "./cli";

async function run() {
  const cli = Cli.getInstance();
  await cli.run();
}

if (require.main === module) {
  run();
}
