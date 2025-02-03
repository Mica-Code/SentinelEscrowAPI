
export type AuthModuleOptions = {
    secret?: string;
};

export type JwtPayload = {
    sub: string; // User ID
    email: string;
};

export type JWTDecodeValue = {
    iat: number;
    exp: number;
    iss?: string;
    aud?: string | string[];
} & JwtPayload;
