import axios from "axios";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import prompts from "prompts";
import {
    TemperatureUnits,
    PrecipationUnits,
    PressureUnits,
    ElevationUnits,
    WindUnits,
    SolarRadiationUnits,
    SoilMoistureUnits,
    HumidityUnits,
} from "../../units.js";
import config from "../../util/config.js";
import cancelled_message from "../../util/cancelled_message.js";
import error_handling from "../../util/error_handling.js";
import connection_failed_message from "../../util/connection_failed_message.js";
import { InterfaceMetaInformation } from "owvision-environment/interfaces";

const create_command = new Command("create")
    .description("Create a new weather station")
    .action(async () => {
        let interfaces: ({
            [Property in string]: any;
        } & { slug: string; meta_information: InterfaceMetaInformation })[] =
            [];
        let spinner = ora("Loading interfaces...").start();
        try {
            const response = await axios({
                url: `${config.get("api_url")}/interfaces`,
                method: "get",
                headers: {
                    OWVISION_AUTH_TOKEN: config.get("auth_token"),
                },
            });
            spinner.stop();
            if (!response.data.success) {
                return error_handling(response, {});
            }
            interfaces = response.data.data;
            if (interfaces.length === 0) {
                return cancelled_message(
                    `There are no interfaces installed. Please install one using ${chalk.italic(
                        `owvision interface install`
                    )}`
                );
            }
        } catch (err) {
            spinner.stop();
            return connection_failed_message();
        }

        const responses = await prompts([
            {
                message: `please choose the station's ${chalk.italic(
                    "interface"
                )}: `,
                type: "select",
                name: "interface_slug",
                choices: interfaces.map((station_interface) => ({
                    title: station_interface.meta_information.name,
                    description: station_interface.meta_information.description,
                    value: station_interface.slug,
                })),
            },
            {
                message: `please enter the station's ${chalk.italic("name")}: `,
                type: "text",
                name: "name",
                validate: (str) => {
                    const valid = str.length > 1 && str.length <= 50;
                    if (valid) return true;
                    else
                        return "Invalid name entered, valid examples: My Vantage Pro, My cool weather station";
                },
            },
            {
                message: `please enter the station's ${chalk.italic("slug")}: `,
                type: "text",
                name: "slug",
                validate: (str) => {
                    const valid =
                        str.length > 1 &&
                        str.length <= 50 &&
                        str.match(/^[a-z-_0-9]*$/);
                    if (valid) return true;
                    else
                        return "Invalid slug entered, valid examples: my-station, cool_weather02";
                },
            },
            {
                message: `are you using a ${chalk.italic(`remote recorder`)}? `,
                type: "select",
                name: "remote_recorder",
                choices: [
                    {
                        title: "no",
                        description: `${chalk.italic(
                            `Recommended.`
                        )} Your weather station has to be connected to the current machine.`,
                        value: false,
                        selected: true,
                    },
                    {
                        title: "yes",
                        description: `${chalk.italic(
                            `For advanced setups.`
                        )} Your weather station is connected to another machine.`,
                        value: true,
                    },
                ],
            },
        ]);
        if (responses.remote_recorder === undefined) return cancelled_message();
        const interface_config_schema = interfaces.filter(
            (any_interface) => any_interface.slug === responses.interface_slug
        )[0].meta_information.config;
        const config_questions: prompts.PromptObject[] = [];
        for (const key in interface_config_schema) {
            const argument = interface_config_schema[key];
            if (argument.type === "select") {
                config_questions.push({
                    name: key,
                    type: argument.type,
                    message: argument.message,
                    choices: argument.choices,
                    // initial: argument.value
                });
            } else if (argument.type === "toggle") {
                config_questions.push({
                    name: key,
                    type: argument.type,
                    message: argument.message,
                    active: argument.active,
                    inactive: argument.inactive,
                    // initial: argument.value
                });
            } else {
                config_questions.push({
                    name: key,
                    type: argument.type,
                    message: argument.message,
                    initial: argument.value,
                });
            }
        }
        const interface_config_responses = await prompts(config_questions);
        for (const key in interface_config_schema) {
            const argument = interface_config_schema[key];

            argument.value = interface_config_responses[key];

            if (interface_config_responses[key] === undefined)
                return cancelled_message();
        }

        const units = await prompts([
            {
                message: `please choose a ${chalk.italic(
                    "temperature unit"
                )}: `,
                type: "select",
                name: "temperature",
                choices: TemperatureUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic(
                    "leaf temperature unit"
                )}: `,
                type: "select",
                name: "leaf_temperature",
                choices: TemperatureUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic(
                    "soil temperature unit"
                )}: `,
                type: "select",
                name: "soil_temperature",
                choices: TemperatureUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic(
                    "precipation unit"
                )}: `,
                type: "select",
                name: "precipation",
                choices: PrecipationUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose an ${chalk.italic(
                    "evo transpiration unit"
                )}: `,
                type: "select",
                name: "evo_transpiration",
                choices: PrecipationUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic("pressure unit")}: `,
                type: "select",
                name: "pressure",
                choices: PressureUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose an ${chalk.italic("elevation unit")}: `,
                type: "select",
                name: "elevation",
                choices: ElevationUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic("wind unit")}: `,
                type: "select",
                name: "wind",
                choices: WindUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic(
                    "solar radiation unit"
                )}: `,
                type: "select",
                name: "solar_radiation",
                choices: SolarRadiationUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic(
                    "soil moisture unit"
                )}: `,
                type: "select",
                name: "soil_moisture",
                choices: SoilMoistureUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
            {
                message: `please choose a ${chalk.italic("humidity unit")}: `,
                type: "select",
                name: "humidity",
                choices: HumidityUnits.map((unit) => ({
                    title: unit,
                    value: unit,
                })),
            },
        ]);
        if (units.humidity === undefined) return cancelled_message();

        spinner = ora("Creating new weather station...").start();
        try {
            const response = await axios({
                url: `${config.get("api_url")}/weather-stations`,
                method: "post",
                headers: {
                    OWVISION_AUTH_TOKEN: config.get("auth_token"),
                },
                data: {
                    name: responses.name,
                    slug: responses.slug,
                    interface_slug: responses.interface_slug,
                    interface_config: interface_config_schema,
                    units,
                    target_state: "active",
                    remote_recorder: responses.remote_recorder,
                },
            });
            spinner.stop();
            if (!response.data.success) {
                return error_handling(response, {});
            }
            console.log(
                chalk.green(
                    `✓ Created station ${chalk.italic(
                        responses.name
                    )} ${chalk.bold(`(${responses.slug})`)}!`
                )
            );
        } catch (err) {
            spinner.stop();
            connection_failed_message();
        }
    });

export default create_command;