import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';
import appConfig from '../configs/appConfig';

class SmartContractServices {
    public static checkUsageCounter = async (tokenId: string): Promise<number> => {
        try {
            const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
            tezos.contract.at('KT1H9kCFuVDCA3kCXgStentobimFVeitbq8A')
                .then(async (contract) => {
                    const viewResult = await contract.contractViews.get_owner('0').executeView({
                        viewCaller: 'KT1KPDBat3prp2G81aDDLyJ38Vbq6YLYFQo8'
                    });
                    console.log(`The result of the view simulation is ${viewResult}.`);
                })
                .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
            // tezos.contract
            //     .at('KT1H9kCFuVDCA3kCXgStentobimFVeitbq8A')
            //     .then((contract) => {
            //         return contract.views.get_usage([{ token_id: '0' }]).read();
            //     })
            //     .then((response) => {
            //         console.log(response);
            //     })
            //     .catch((error) => {
            //         console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`)
            //     });
        } catch(err) {
            console.log(err);
            return -1;
        }
    }

    public static checkOwnership = async (address: string, tokenId: string): Promise<boolean> => {
        const tezos = new TezosToolkit(appConfig.contract.rpcUrl);
        const contract = await tezos.contract.at(appConfig.contract.address);
        if(tokenId === '1') return true;
        return false;
    }
}

export default SmartContractServices;