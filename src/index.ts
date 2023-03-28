import express from "express";
import pinataSDK from "@pinata/sdk";
import routes from './routes/router';
import appConfig from './configs/appConfig';
import cors from "cors";

const app = express();
const port = process.env.NODE_ENV === "production" ? process.env.PORT : 8080;

export const pinata = new pinataSDK(appConfig.pinata.apiKey, appConfig.pinata.apiSecret);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use('/', routes);
app.listen(port, async () => {
  console.log(`Server started at port ${port}`);
  await pinata
        .testAuthentication()
        .then(() => console.log(`Successfully connected to Pinata`))
        .catch((err: any) => console.error(`Pinata connection failed`, err));
});

// const corsOptions = {
//   origin: ["http://localhost:8082"],
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
