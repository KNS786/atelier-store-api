import { Schema, model, Types } from 'mongoose';

const refereshTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    token: { type: String, required: true},
    expiresAt: { type: Date, required: true}
})

export const RefreshToken = model('RefreshToken', refereshTokenSchema);