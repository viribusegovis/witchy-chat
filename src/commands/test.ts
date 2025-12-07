import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { executeRCON } from "../utils/rcon.js";

export const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test RCON connectivity")
    .addStringOption(opt => opt.setName("host").setDescription("Host to test").setRequired(true))
    .addIntegerOption(opt => opt.setName("port").setDescription("Port to test").setRequired(true))
    .addStringOption(opt => opt.setName("password").setDescription("RCON password").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const host = interaction.options.getString("host", true);
    const port = interaction.options.getInteger("port", true);
    const password = interaction.options.getString("password", true);

    try {
        const result = await executeRCON({ name: "test", channelId: "", rconHost: host, rconPort: port, rconPassword: password }, "list");
        await interaction.editReply(`✅ Connected!\n\`\`\`${result}\`\`\``);
    } catch (error) {
        await interaction.editReply(`❌ Failed: ${error}`);
    }
}
