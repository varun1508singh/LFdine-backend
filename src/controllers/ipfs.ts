import { Request, Response } from 'express';
import { pinata } from '../index';
import fs from "fs";
import { ErrorType } from '../interfaces/interface';
import { logger } from '../utils/logger.utils';

class IpfsController {
    public static uploadGenericMetadata = async (req: Request, res: Response) => {
        const metadata = req.body('metadata');
        try{
            const pinnedMetadata = await pinata.pinJSONToIPFS(metadata, {
                pinataMetadata: {
                    name: "TUT-metadata"
                }
            });
            if (pinnedMetadata.IpfsHash && pinnedMetadata.PinSize > 0) {
                return res.status(200).json({
                    status: true,
                    msg: {
                    metadataHash: pinnedMetadata.IpfsHash
                    }
                });
            } else {
                return res.status(400).json({ status: false, msg: "metadata were not pinned" });
            }
        } catch(error) {
            logger( ErrorType.error, `metadata: ${metadata} | unable to pin metadata`, error);
            return res.status(400).json({ status: false, msg: "metadata were not pinned" });
        }
    }

    public static uploadNftMetadata = async (req: any, res: any) => {
        const body = JSON.parse(req.body.data);

        const multerReq = req as any;
        if (!multerReq.file){
            return res.status(400).json({
                status: false,
                msg: "no file provided"
            });
        }
        const fileName = multerReq.file.filename;
        const readableStreamForFile = fs.createReadStream(`./uploads/${fileName}`);

        await pinata
            .testAuthentication()
            .catch((err: any) => {
                return res.status(400).json(JSON.stringify(err))
            });

        const options: any = {
            pinataMetadata: {
                name: body.title.replace(/\s/g, "-"),
                keyvalues: {
                    description: body.description
                }
            }
        };

        try{
            const pinnedFile = await pinata.pinFileToIPFS(
                readableStreamForFile,
                options
            );
            if (!pinnedFile.IpfsHash && pinnedFile.PinSize < 0) {
                return res.status(400).json({
                    status: false,
                    msg: "file was not pinned"
                });
            }

            fs.unlinkSync(`./uploads/${fileName}`);

            const metadata = {
                name: body.title,
                description: body.description,
                symbol: "TUT",
                artifactUri: `ipfs://${pinnedFile.IpfsHash}`,
                displayUri: `ipfs://${pinnedFile.IpfsHash}`,
                creators: [body.creator],
                decimals: 0,
                thumbnailUri: "https://tezostaquito.io/img/favicon.png",
                is_transferable: true,
                shouldPreferSymbol: false
            };
            const pinnedMetadata = await pinata.pinJSONToIPFS(metadata, {
                pinataMetadata: {
                name: "TUT-metadata"
                }
            });
            if (!pinnedMetadata.IpfsHash && pinnedMetadata.PinSize < 0) {
                return res.status(400).json({
                    status: false,
                    msg: "metadata were not pinned"
                });
            }
            return res.status(200).json({
                status: true,
                msg: {
                    imageHash: pinnedFile.IpfsHash,
                    metadataHash: pinnedMetadata.IpfsHash
                }
            });
        } catch(error) {
            logger( ErrorType.error, `options: ${options}, body: ${body}, filename: ${fileName} | Pinata actions failed`, error);
            return;
        }
    }
}

export default IpfsController;
