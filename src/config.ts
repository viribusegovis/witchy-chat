import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, ADMIN_ROLE_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing environment variables");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    ADMIN_ROLE_ID: ADMIN_ROLE_ID ?? "", // Role ID for admin commands
};
