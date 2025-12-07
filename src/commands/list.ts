import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags} from "discord.js";
import { getServerByChannel } from "../utils/dataManager.js";
import { executeRCON, stripMinecraftColors } from "../utils/rcon.js";


export const data = new SlashCommandBuilder()
    .setName("list")
    .setDescription("List players on the Minecraft server for this channel");

export async function execute(interaction: ChatInputCommandInteraction) {
    const server = getServerByChannel(interaction.channelId);

    if (!server) {
        await interaction.reply({
            content: "❌ This channel is not linked to any Minecraft server.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    await interaction.deferReply();

    try {
        const rawResponse = await executeRCON(server, "list");
        const response = stripMinecraftColors(rawResponse);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`📋 ${server.name} - Player List`)
            .setDescription(`\`\`\`\n${response}\n\`\`\``)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error("RCON Error:", error);
        await interaction.editReply({
            content: `❌ Failed to connect to ${server.name}.`,
        });
    }
}
