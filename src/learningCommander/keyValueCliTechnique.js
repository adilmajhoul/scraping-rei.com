import { Command } from "commander";

const program = new Command();

program
  .name("string-util")
  .description("CLI to some JavaScript string utilities")
  .version("0.8.0");

program
  .command("convert")
  .description("Convert a person object to JSON string")
  .option(
    "-p, --person <keyValuePairs>",
    "person object as key-value pairs",
    "name=John,age=30,city=New York,country=USA,language=English,married=true"
  )
  .action((options) => {
    const person = {};
    const keyValuePairs = options.person.split(",");
    keyValuePairs.forEach((pair) => {
      let [key, value] = pair.split("=");

      //   convert string bolean to real boolean
      value = value === "true" ? true : value;
      value = value === "false" ? false : value;

      person[key] = value;
    });
    let jsonPerson = convertPersonToJSON(person);
    console.log("🚀 ~ .action ~ jsonPerson:", jsonPerson);
    console.log("🚀 ~ .action ~ person:", person);
  });

function convertPersonToJSON(person) {
  let jsonPerson = JSON.stringify(person, null, 2);
  return jsonPerson;
}

program.parse();
