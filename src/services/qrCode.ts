import qr from "qrcode";
import { ErrorType, NftData } from "../interfaces/interface";
import { logger } from "../utils/logger.utils";

class QrCodeServices {
    public static generateQrCode = async (userAddress: string, tokenId: number): Promise<String> => {
        const data = {
            address: userAddress,
            tokenId: tokenId
        }
        try {
            return await qr.toDataURL(JSON.stringify(data))
        } catch (error) {
            logger(
                ErrorType.error,
                `Unable to generate the QR code for the following NFT data: ${data}`,
                error,
            );
            return '';
        }
    }
}

export default QrCodeServices;