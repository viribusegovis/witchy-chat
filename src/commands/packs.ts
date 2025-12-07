import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags} from "discord.js";
import { getPacks } from "../utils/dataManager.js";

export const data = new SlashCommandBuilder()
    .setName("packs")
    .setDescription("Show all modpack versions");

export async function execute(interaction: ChatInputCommandInteraction) {
    const packs = getPacks();

    if (packs.length === 0) {
        await interaction.reply({
            content: "📦 No modpacks configured yet.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(0x9B59B6)
        .setTitle("📦 Modpack Versions")
        .setDescription(
            packs.map(p => `**${p.name}**: \`${p.version}\``).join("\n")
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
