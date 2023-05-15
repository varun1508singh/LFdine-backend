import { Request, Response } from "express";
import ExternalServices from "../services/externalServices";
import { ErrorType, TokenData, UserResponse } from "../interfaces/interface";
import { logger } from "../utils/logger.utils";
import SmartContractServices from "../services/smartContract";

class UserController {
    public static fetchUserNfts = async (req: Request, res: Response) => {
        const userAddress = req.query.address as string;

        const userNFTs = await ExternalServices.fetchUserNFTs(userAddress);
        if(!userNFTs) {
            logger(
                ErrorType.info,
                `userRequest: ${userAddress} | Unable to fetch users NFTs from TZKT`
            );
            return res.status(500).send({
                success: false,
                response: UserResponse.NFT_FETCH_ERROR,
            });
        } else if (userNFTs.length === 0) {
            logger(
                ErrorType.info,
                `userRequest: ${userAddress} | User does not own any LFDine NFTs`
            );
            return res.status(200).send({
                success: true,
                response: userNFTs,
            });
        }

        const nftMetadata = await SmartContractServices.fetchNFTMetadata(userNFTs);
        console.log(nftMetadata);

        return res.status(200).send({
            success: true,
            response: userNFTs,
        });
    }
}

export default UserController;