import { Command } from "commander";
import config from "../../util/config.js";
import chalk from "chalk";

const set_command = new Command("set")
    .argument("<key>")
    .argument("<value>")
    .description("Configure a parameter")
    .action((key, value) => {
        const success = config.set(key, value);
        if (success) {
            config.save();
            console.log(`${chalk.green(`✓ Successfully set '${key}'`)}`)
        } else {
            console.log(`${chalk.redBright(`✘Unknown setting '${key}'`)}`)
        }
    })

export default set_command;