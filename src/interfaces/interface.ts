export interface Env {
    isDev(): boolean;
    isProd(): boolean;
}

export interface NftData {
    usage: number,
    owner: string
}

export enum Usage {
    'error' = -1,
    'valid' = 0,
}

export enum ErrorType {
    'fatal' = 'Fatal',
    'error' = 'ERROR',
    'info' = 'INFO'
}

export enum UserResponse {
    'SUCCESSFUL_REDEMPTION' = 'Successfully redeemed NFT',
    'INTERNAL_ERROR' = 'Unable to verify NFT please try again',
    'USAGE_REDEEM_ERROR' = 'NFT redemption unsuccessful, NFT has already been used',
    'OWNER_REDEEM_ERROR' = 'NFT redemption unsuccessful, NFT owner does not match',
    'USAGE_ERROR' = 'NFT has been redeemed already. Please select a different one',
    'OWNER_ERROR' = 'Invalid owner. Please select an NFT that you own',
}