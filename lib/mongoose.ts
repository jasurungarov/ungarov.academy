import dns from "dns";
import mongoose, { ConnectOptions } from "mongoose";

// Existing DNS configuration
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async () => {
  const mongoUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  // Validate environment variables
  if (!mongoUrl) {
    throw new Error("Missing MONGODB_URL environment variable");
  }

  if (!dbName) {
    throw new Error("Missing MONGODB_DB environment variable");
  }

  mongoose.set("strictQuery", true);

  // Reuse an existing connection
  if (mongoose.connection.readyState === 1) {
    if (mongoose.connection.name !== dbName) {
      throw new Error(
        "MongoDB is connected to a different database. Restart the server.",
      );
    }

    return;
  }

  // Prevent duplicate connection attempts
  if (!connectionPromise) {
    const options: ConnectOptions = {
      dbName,
      autoCreate: true,
    };

    connectionPromise = mongoose
      .connect(mongoUrl, options)
      .then((connection) => {
        console.log(
          `[MongoDB] Connected to database: ${connection.connection.name}`,
        );

        return connection;
      })
      .catch((error) => {
        connectionPromise = null;

        console.error("[MongoDB] Connection failed:", error);

        throw error;
      });
  }

  await connectionPromise;
};
