import { User } from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const registerUser = async (data: any) => {
    data.password = await hashPassword(data.password);
    return User.create(data);
}

export const loginUser = async (email: string, password: string ) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error("User not found");
    }

    const isMatch = await comparePassword(password, user.password);

    if(!isMatch){
        throw new Error("Invalid credentials")
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role});

    const refreshToken = generateRefreshToken({ id: user._id });

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 )
    })

    return {
        userId: user._id,
        accessToken,
        refreshToken,
    }

}