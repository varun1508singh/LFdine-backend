import { Env } from '../interfaces/interface';

const envConfig: Env = {
    isDev: () => process.env.NODE_APP_ENV === `dev`,
    isProd: () => process.env.NODE_APP_ENV === `prod`,
};

const serverCredentials = {
    envConfig,
    name: process.env.NODE_APP_ENV,
    port: process.env.NODE_APP_PORT,
};

const pinataKeys = {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
};

const appConfig = {
    server: serverCredentials,
    pinata: pinataKeys,
};

export default appConfig;
