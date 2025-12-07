import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getServerByChannel } from "../utils/dataManager.js";
import { executeRCON, stripMinecraftColors } from "../utils/rcon.js";

export const data = new SlashCommandBuilder()
    .setName("tps")
    .setDescription("Get TPS information from the server");

export async function execute(interaction: ChatInputCommandInteraction) {
    const server = getServerByChannel(interaction.channelId);

    if (!server) {
        await interaction.reply({
            content: "❌ This channel is not linked to any Minecraft server.",
        });
        return;
    }

    await interaction.deferReply();

    try {
        const rawResponse = await executeRCON(server, "neoforge tps");
        let response = stripMinecraftColors(rawResponse);

        // Split by dimension patterns - add newline after closing parenthesis
        response = response
            .replace(/\)/g, ")\n")  // Add newline after each )
            .trim();  // Remove extra whitespace

        const embed = new EmbedBuilder()
            .setColor(0x00AAFF)
            .setTitle(`⚡ ${server.name} - TPS`)
            .setDescription(`\`\`\`\n${response}\n\`\`\``)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error("RCON Error:", error);
        await interaction.editReply({
            content: `❌ Failed to get TPS from ${server.name}.`,
        });
    }
}
