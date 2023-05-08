import { Request, Response } from "express";
import SmartContractServices from "../services/smartContract";

class RedemptionController {
    public static generateQrCode = async (req: Request, res: Response) => {
        const userAddress = req.body.address;
        const nftTokenId = req.body.tokenId;

        const usageCounter = await SmartContractServices.checkUsageCounter(nftTokenId);
        if(usageCounter > 0){
            return res.status(500).send({
                success: false,
                response: `NFT has been redeemed already. Please select a different one`
            });
        }

        // const nftOwnership = await SmartContractServices.checkOwnership(userAddress, nftTokenId);
        // if(!nftOwnership){
        //     return res.status(500).send({
        //         success: false,
        //         response: `Unable to verify NFT please try again`
        //     });
        // }

        // const qrCode = await QrCodeServices.generateQrCode();

        return res.status(200).send({
            success: true,
            response: `NFT verified`
        });
    }

    public static redeemQrCode = async (req: Request, res: Response) => {
    }
}

export default RedemptionController;