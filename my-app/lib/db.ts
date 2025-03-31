import mongoose from "mongoose";
import { error } from "console";


const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw error('Define MONGODB_URI')
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error
    }

    return cached.conn
}