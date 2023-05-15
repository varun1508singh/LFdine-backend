import express from "express";
import pinataSDK from "@pinata/sdk";
import routes from './routes/router';
import appConfig from './configs/appConfig';
import cors from "cors";
import { ErrorType } from "./interfaces/interface";
import { logger } from "./utils/logger.utils";

const app = express();
const port = process.env.NODE_ENV === "production" ? process.env.PORT : 8080;

// const corsOptions = {
//   origin: ["],
//   optionsSuccessStatus: 200
// };
app.use(cors());

export const pinata = new pinataSDK(appConfig.pinata.apiKey, appConfig.pinata.apiSecret);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use('/', routes);
app.listen(port, async () => {
  logger( ErrorType.info, `Server started at port ${port}`);
  await pinata
        .testAuthentication()
        .then(() => logger( ErrorType.info, `Successfully connected to Pinata`))
        .catch((error: any) => logger( ErrorType.error, `Pinata connection failed`, error));
});
