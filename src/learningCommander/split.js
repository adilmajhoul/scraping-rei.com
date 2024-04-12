import { program } from "commander";

program.option("--i, --index <number>").option("-s, --separator <char>");

program.parse();

const options = program.opts();
console.log("🚀 ~ options:", options);
console.log(program.args[0].split(options.separator)[options.index]);
console.log("🚀 ~ program.args:", program.args);
