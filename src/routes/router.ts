import { Router } from "express";
import IpfsController from '../controllers/ipfs';
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const routes = Router();

routes.get('/health', (_req, res) => {
    res.send({ alive: true });
});

//IPFS
routes.get("/metadata", IpfsController.uploadGenericMetadata);
routes.post("/mint", upload.single("image"), IpfsController.uploadNftMetadata);

export default routes;