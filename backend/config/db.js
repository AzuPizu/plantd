const mongoose = require('mongoose');

/**
 * Vercel can reuse the same "warm" serverless instance across requests,
 * but it can also spin up a brand new one at any time (cold start).
 * We cache the connection (and the in-flight connection promise) on the
 * global object so that:
 *   - warm invocations reuse the existing connection instantly
 *   - cold invocations only connect once, and every request that comes in
 *     while that connection is still being established simply waits on
 *     the same promise instead of firing a query before Mongoose is ready
 */
let cached = global._mongooseConn;

if (!cached) {
    cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        mongoose.set('strictQuery', true);

        cached.promise = mongoose
            .connect(process.env.MONGODB_URI, {
                // Fail fast instead of silently buffering queries for 10s
                bufferCommands: false,
                // Don't hang forever trying to find the Atlas cluster
                serverSelectionTimeoutMS: 8000,
                // Keep the pool small - serverless functions are short-lived
                maxPoolSize: 10,
            })
            .then((mongooseInstance) => {
                console.log('✅ Connected to MongoDB Atlas');
                return mongooseInstance;
            })
            .catch((error) => {
                // Reset so the NEXT request gets a chance to retry the
                // connection instead of being stuck on a dead promise
                cached.promise = null;
                console.error('❌ MongoDB connection failed:', error.message);
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
