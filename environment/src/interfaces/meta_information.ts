import vine from "@vinejs/vine"
import { TimeUnit } from "../scheduler/scheduler.js"

export type MetaInformation = {
    name: string,
    description: string,
    author?: string,
    sensors: SensorInformation[],
}

export type SensorInformation = {
    slug: string,
    name: string,
    description?: string,
    record_interval: string | {
        configurable?: boolean,
        default: string,
        choices?: string[],
        range?: [string | null, string | null]
    }
}
  
const interval = vine.string();

const meta_information_validator = vine.compile(vine.object({
    name: vine.string().maxLength(100).minLength(1),
    description: vine.string().maxLength(200),
    author: vine.string().optional(),
    sensors: vine.array(vine.object({
        slug: vine.string(),
        name: vine.string(),
        description: vine.string().optional(),
        record_interval: vine.union([
            vine.union.if((record_interval) => vine.helpers.isString(record_interval), interval.clone()),
            vine.union.else(vine.object({
                default: interval.clone(),
                configurable: vine.boolean().optional(),
                choices: vine.array(interval.clone()).optional(),
                range: vine.tuple([interval.clone().nullable(), interval.clone().nullable()])
            }))
        ])
}))}));

export async function validate_meta_information(payload: any){
    return meta_information_validator.validate(payload);
}