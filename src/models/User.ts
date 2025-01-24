// # This is the User model

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    username: { type: String, required: true, trim: true, minlength: 3},
    createdAt: {type: Date,default: Date.now}
});

// now we hash the password before saving it to the database
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error:any) {
        next(error);
    }
})

// method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
}


export default mongoose.model<IUser>('User', UserSchema);