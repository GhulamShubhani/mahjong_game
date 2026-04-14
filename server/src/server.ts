import dotenv from "dotenv";
import app from "./app";
import { connectToDatabase } from "./config/db.config";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void start();