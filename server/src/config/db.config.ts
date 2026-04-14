import { connect } from "mongoose";


export const connectToDatabase = async() => {
    try {
        const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/mahjong";
        console.log("Connecting to database...");
        await connect(connectionString);
        console.log("Connected to database successfully.");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}