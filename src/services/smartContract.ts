import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';
import { Tzip16Module, tzip16 } from "@taquito/tzip16";
import appConfig from '../configs/appConfig';
import { ErrorType, NftData, TokenData } from '../interfaces/interface';
import { logger } from '../utils/logger.utils';
import ExternalServices from './externalServices';

class SmartContractServices {
    public static onChainAuthorization = async (tokenId: number): Promise<NftData> => {
        const contractAddress = appConfig.contract.address;
        const tezos = new TezosToolkit(appConfig.contract.rpcUrl);
        tezos.addExtension(new Tzip16Module());

        const usageCount = await tezos.contract
            .at(contractAddress, tzip16)
            .then((contract) => {
                logger(
                    ErrorType.info,
                    `tokenId: ${tokenId}, contractAddress: ${contractAddress} | Initializing the views`
                );
                return contract.tzip16().metadataViews();
            })
            .then(async (views) => {
                logger(
                    ErrorType.info,
                    `tokenId: ${tokenId}, contractAddress: ${contractAddress} | The following view names were found in the metadata: ${Object.keys(views)}`
                );
                const usage = await views.get_usage().executeView(tokenId);
                const owner = await views.get_owner().executeView(tokenId);
                return {
                    usage: usage.toNumber(),
                    owner: owner.toString(),
                }
            })
            .catch((error) => {
                logger(
                    ErrorType.error,
                    `tokenId: ${tokenId}, contractAddress: ${contractAddress} | Unable to get_usage or get_owner for the following`,
                    error,
                );
                return { usage: -1, owner: '' };
            });
        return usageCount;
    }

    public static updateTokenUsage = async (tokenId: number) => {
        const contractAddress = appConfig.contract.address;
        const pk = appConfig.contract.key;
        const tezos = new TezosToolkit(appConfig.contract.rpcUrl);

        tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(pk) });

        const usageIncrement = await tezos.contract
            .at(contractAddress)
            .then(async (contract) => {
                return await contract.methods.update_usage(tokenId).send();
            })
            .then((op) => {
                logger(
                    ErrorType.info,
                    `tokenId: ${tokenId}, contractAddress: ${contractAddress} | Waiting for ${op.hash} to be confirmed...`,
                );
                return op.confirmation(3).then(() => op.hash);
            })
            .then((hash) => {
                logger(
                    ErrorType.info,
                    `tokenId: ${tokenId}, contractAddress: ${contractAddress} | Operation injected: https://ghost.tzstats.com/${hash}`,
                );
                return hash;
            })
            .catch((error) => {
                logger(
                    ErrorType.error,
                    `tokenId: ${tokenId}, contractAddress: ${contractAddress} | Unable to update usage counter`,
                    error,
                );
                return '';
            });
        return usageIncrement;
    }

    public static fetchNFTMetadata = async (tokenData: TokenData[]): Promise<TokenData[]> => {
        const contractAddress = appConfig.contract.address;
        const tezos = new TezosToolkit(appConfig.contract.rpcUrl);
        tezos.addExtension(new Tzip16Module());

        const newTokenMetadata = await tezos.contract
            .at(contractAddress, tzip16)
            .then((contract) => {
                logger(
                    ErrorType.info,
                    `contractAddress: ${contractAddress} | Initializing the views`
                );
                return contract.tzip16().metadataViews();
            })
            .then(async (views) => {
                logger(
                    ErrorType.info,
                    `contractAddress: ${contractAddress} | The following view names were found in the metadata: ${Object.keys(views)}`
                );
                return await Promise.all(tokenData.map(async (token) => {
                    const tokenId = parseInt(token.token.tokenId);
                    const hash = await views.get_metadata().executeView(tokenId);
                    token.token.metadata = Buffer.from(hash, 'hex').toString();
                    return token;
                }));
            })
            .catch((error) => {
                logger(
                    ErrorType.error,
                    `tokenData: ${JSON.stringify(tokenData)}, contractAddress: ${contractAddress} | Unable to get_usage or get_owner for the following`,
                    error,
                );
                return tokenData;
            });
        return newTokenMetadata;
    }
}

export default SmartContractServices;