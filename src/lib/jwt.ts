import jwt from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from "@/lib/constants";

export const generateAccessToken = (payload: {userId:string, email:string}): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET as jwt.Secret, {expiresIn: "2h"});
}

export const verifyAccessToken = (token: string) : {userId:string, email:string} => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET as jwt.Secret) as {userId:string, email:string};
}

export const generateRefreshToken = (payload: {userId:string, email:string}): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET as jwt.Secret, {expiresIn: "7d"});
}

export const verifyRefreshToken = (token: string) : {userId:string, email:string} => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET as jwt.Secret) as {userId:string, email:string};
}