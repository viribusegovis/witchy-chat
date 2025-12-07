import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits } from "discord.js";
import { config } from "../config.js";

export function isAdmin(interaction: ChatInputCommandInteraction): boolean {
    const member = interaction.member as GuildMember | null;

    if (!member) return false;

    // Check for Administrator permission
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
        return true;
    }

    // Check for specific admin role
    if (config.ADMIN_ROLE_ID && member.roles.cache.has(config.ADMIN_ROLE_ID)) {
        return true;
    }

    return false;
}
