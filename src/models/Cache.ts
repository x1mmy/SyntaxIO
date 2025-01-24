import mongoose, { Schema, Document } from 'mongoose';

export interface ICache extends Document {
    key: string;
    data: any;
    expiresAt: Date;
}

const CacheSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // This will automatically delete documents when they expire
    }
});

// Create index for faster lookups
CacheSchema.index({ key: 1 });

export default mongoose.model<ICache>('Cache', CacheSchema);
