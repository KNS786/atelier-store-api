import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
    await authService.registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully'});
}

export const login =  async (req: Request, res: Response) => {
    const tokens = await authService.loginUser(req.body.email, req.body.password);
    res.status(200).json(tokens);
}