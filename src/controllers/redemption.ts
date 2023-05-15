import { Request, Response } from "express";
import SmartContractServices from "../services/smartContract";
import QrCodeServices from "../services/qrCode";
import { ErrorType, Usage, UserResponse } from "../interfaces/interface";
import { logger } from "../utils/logger.utils";

class RedemptionController {
    public static generateQrCode = async (req: Request, res: Response) => {
        const userAddress = req.body.address;
        const nftTokenId = parseInt(req.body.tokenId);

        const nftData = await SmartContractServices.onChainAuthorization(nftTokenId);
        if(nftData.usage === Usage.error || nftData.owner==='') {
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Unable to fetch NFT data. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.INTERNAL_ERROR,
            });
        }
        if(nftData.usage > Usage.valid){
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Fetched usage (${nftData.usage}) is more than ${Usage.valid}. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.USAGE_ERROR,
            });
        }
        if(nftData.owner != userAddress){
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Fetched owner (${nftData.owner}) does not match given user address. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.OWNER_ERROR,
            });
        }

        const qrCode = await QrCodeServices.generateQrCode(userAddress, nftTokenId);
        if(qrCode === ''){
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Unable to generate QR code. QR code is ${qrCode}. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.INTERNAL_ERROR,
            });
        }
        logger(
            ErrorType.info, 
            `userRequest: ${userAddress}, token: ${nftTokenId} | Successfully generated QR code. NFT data is ${JSON.stringify(nftData)}`
        );
        return res.status(200).send({
            success: true,
            response: qrCode,
        });
    }

    public static redeemQrCode = async (req: Request, res: Response) => {
        const userAddress = req.body.address;
        const nftTokenId = parseInt(req.body.tokenId);

        const nftData = await SmartContractServices.onChainAuthorization(nftTokenId);
        if(nftData.usage === Usage.error || nftData.owner==='') {
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Unable to fetch NFT data. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.INTERNAL_ERROR,
            });
        }
        if(nftData.usage > Usage.valid){
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Fetched usage (${nftData.usage}) is more than ${Usage.valid}. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.USAGE_REDEEM_ERROR,
            });
        }
        if(nftData.owner != userAddress){
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Fetched owner (${nftData.owner}) does not match given user address. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.OWNER_REDEEM_ERROR,
            });
        }

        const updateNftUsage = await SmartContractServices.updateTokenUsage(nftTokenId);
        if(updateNftUsage === ''){
            logger(
                ErrorType.error,
                `userRequest: ${userAddress}, token: ${nftTokenId} | Unable to increment NFT usage counter. NFT data is ${JSON.stringify(nftData)}`
            );
            return res.status(400).send({
                success: false,
                response: UserResponse.INTERNAL_ERROR,
            });
        }

        logger(
            ErrorType.info, 
            `userRequest: ${userAddress}, token: ${nftTokenId} | Successfully redeemed NFT, tx_hash ${updateNftUsage}. NFT data is ${JSON.stringify(nftData)}`
        );
        return res.status(200).send({
            success: true,
            response: UserResponse.SUCCESSFUL_REDEMPTION,
        });
    }
}

export default RedemptionController;