import { TezosToolkit } from '@taquito/taquito'
import { Tzip16Module, tzip16 } from "@taquito/tzip16";
import appConfig from '../configs/appConfig';
import { ErrorType, NftData } from '../interfaces/interface';
import { logger } from '../utils/logger.utils';

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
                    `Initializing the views for ${contractAddress}...`
                );
                return contract.tzip16().metadataViews();
            })
            .then(async (views) => {
                logger(
                    ErrorType.info,
                    `The following view names were found in the metadata: ${Object.keys(views)}`
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
                    `Unable to get_usage or get_owner for the following token_id: ${tokenId} from contract address: ${contractAddress}`,
                    error,
                );
                return { usage: -1, owner: '' };
            });
        return usageCount;
    }
}

export default SmartContractServices;