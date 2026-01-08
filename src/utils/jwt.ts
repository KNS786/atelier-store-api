import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string ) => 
    bcrypt.hash(password, 10);

export const comparePassword = (password: string, hash: string ) => 
    bcrypt.compare(password, hash);

export const generateAccessToken = (payload: object) => 
    jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' })

export const generateRefreshToken = (payload: object) => 
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d'})