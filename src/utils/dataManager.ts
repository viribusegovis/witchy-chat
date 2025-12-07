import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

export interface PackInfo {
    name: string;
    version: string;
}

export interface ServerConfig {
    name: string;
    channelId: string;
    rconHost: string;
    rconPort: number;
    rconPassword: string;
}

function readJSON<T>(path: string, defaultValue: T): T {
    try {
        if (!existsSync(path)) {
            writeFileSync(path, JSON.stringify(defaultValue, null, 2), "utf-8");
            return defaultValue;
        }

        let content = readFileSync(path, "utf-8");

        // Strip BOM if present
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        // Handle empty files
        content = content.trim();
        if (!content) {
            writeFileSync(path, JSON.stringify(defaultValue, null, 2), "utf-8");
            return defaultValue;
        }

        return JSON.parse(content) as T;
    } catch (error) {
        console.error(`Error reading ${path}, resetting to default:`, error);
        writeFileSync(path, JSON.stringify(defaultValue, null, 2), "utf-8");
        return defaultValue;
    }
}

function writeJSON(path: string, data: unknown): void {
    writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

// Packs management
const PACKS_PATH = join(DATA_DIR, "packs.json");

export function getPacks(): PackInfo[] {
    return readJSON<PackInfo[]>(PACKS_PATH, []);
}

export function setPack(name: string, version: string): void {
    const packs = getPacks();
    const existing = packs.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (existing) {
        existing.version = version;
    } else {
        packs.push({ name, version });
    }

    writeJSON(PACKS_PATH, packs);
}

export function removePack(name: string): boolean {
    const packs = getPacks();
    const index = packs.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

    if (index === -1) return false;

    packs.splice(index, 1);
    writeJSON(PACKS_PATH, packs);
    return true;
}

// Server config management
const SERVERS_PATH = join(DATA_DIR, "servers.json");

export function getServers(): ServerConfig[] {
    return readJSON<ServerConfig[]>(SERVERS_PATH, []);
}

export function getServerByChannel(channelId: string): ServerConfig | undefined {
    return getServers().find(s => s.channelId === channelId);
}

export function setServer(server: ServerConfig): void {
    const servers = getServers();
    const index = servers.findIndex(s => s.channelId === server.channelId);

    if (index >= 0) {
        servers[index] = server;
    } else {
        servers.push(server);
    }

    writeJSON(SERVERS_PATH, servers);
}

export function removeServer(channelId: string): boolean {
    const servers = getServers();
    const index = servers.findIndex(s => s.channelId === channelId);

    if (index === -1) return false;

    servers.splice(index, 1);
    writeJSON(SERVERS_PATH, servers);
    return true;
}
