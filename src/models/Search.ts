import mongoose, { Schema, Document } from "mongoose";

// Search model: Stores user search queries and their results

//Interface represents a search document with user info, query details, and results
export interface ISearch extends Document {
    userId: mongoose.Types.ObjectId;
    query: string;
    context: string;
    results: Array<{
        source: string;
        content: string;
        relevanceScore: number;
    }>;
    timestamp: Date;
}

// Schema defines the structure for storing searches in MongoDB
const SearchSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    query: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        required: true,
    },
    results: [
        {
            source: String,
            content: String,
            relevanceScore: Number,
        },
    ],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ISearch>("Search", SearchSchema);
