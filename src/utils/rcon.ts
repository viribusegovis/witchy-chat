import { RCON } from "minecraft-server-util";
import type { ServerConfig } from "./dataManager.js";

// Strip Minecraft color/formatting codes (§x and §#hexcodes)
export function stripMinecraftColors(text: string): string {
    return text
        .replace(/§[0-9a-fk-or]/gi, "")  // Standard color codes
        .replace(/§x(§[0-9a-f]){6}/gi, "") // Hex color codes
        .replace(/[\x00-\x1F]/g, "")       // Control characters
        .trim();
}

export async function executeRCON(server: ServerConfig, command: string): Promise<string> {
    const client = new RCON();

    try {
        await client.connect(server.rconHost, server.rconPort);
        await client.login(server.rconPassword);
        const response = await client.execute(command);
        await client.close();
        return response;
    } catch (error) {
        try {
            await client.close();
        } catch {
            // Ignore close errors
        }
        throw error;
    }
}
