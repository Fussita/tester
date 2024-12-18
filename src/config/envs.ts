import { configDotenv } from 'dotenv';
import * as joi from 'joi';
import { join } from 'path';

configDotenv(
    { path: join(__dirname, '../../../.env') }
)

interface EnvVars {
    PORT: string;
    RABBIT: string
}

const envsSchema = joi.object({
    PORT: joi.string().required(),
    RABBIT: joi.string().required(),
}).unknown(true);

const {error, value} = envsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`)

const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,
    rabbitmq_host: envVars.RABBIT,
}