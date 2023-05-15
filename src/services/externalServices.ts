import axios from "axios";
import appConfig from "../configs/appConfig";
import { ErrorType, TokenData } from "../interfaces/interface";
import { logger } from "../utils/logger.utils";

class ExternalServices {
    public static fetchUserNFTs = async (address: string): Promise<TokenData[]> => {
        const contract = appConfig.contract.address;
        const config = {
            method: 'get',
            url: `https://api.ghostnet.tzkt.io/v1/tokens/balances?account=${address}&token.contract=${contract}`,
        };
        return axios.request(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                logger(
                    ErrorType.error,
                    `account: ${address}, contractAddress: ${contract} | Unable to fetch user's NFTs from TZKT`,
                    error,
                );
                return;
            });
    }

    public static fetchNftMetadata = async (hash: string) => {
        const contract = appConfig.contract.address;
        const config = {
            method: 'get',
            url: `https://lfdine.mypinata.cloud/ipfs/${hash}`,
        };
        return axios.request(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                logger(
                    ErrorType.error,
                    `hash: ${hash}, contractAddress: ${contract} | Unable to fetch NFT metadata from IPFS`,
                    error,
                );
                return;
            });
    }
}

export default ExternalServices;