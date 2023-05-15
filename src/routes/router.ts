import { Router } from "express";
import IpfsController from '../controllers/ipfs';
import RedemptionController from "../controllers/redemption";
import UserController from "../controllers/user";
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const routes = Router();

routes.get('/health', (_req, res) => {
    res.send({ alive: true });
});

//IPFS
routes.get("/metadata", IpfsController.uploadGenericMetadata);
routes.post("/mint", upload.single("image"), IpfsController.uploadNftMetadata);

//Redemption
routes.post("/qr/generate", RedemptionController.generateQrCode);
routes.post("/qr/redeem", RedemptionController.redeemQrCode);

//Fetch User NFTs
routes.get("/user/listNft", UserController.fetchUserNfts);

export default routes;