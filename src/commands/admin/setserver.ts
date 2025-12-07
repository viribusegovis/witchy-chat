import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from "discord.js";
import { setServer, removeServer, getServers } from "../../utils/dataManager.js";
import { isAdmin } from "../../utils/permissions.js";
import { MessageFlags } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("setserver")
    .setDescription("Manage server configurations (Admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
        sub.setName("add")
            .setDescription("Add or update a server config")
            .addStringOption(opt => opt.setName("name").setDescription("Server name").setRequired(true))
            .addChannelOption(opt => opt.setName("channel").setDescription("Linked channel").addChannelTypes(ChannelType.GuildText).setRequired(true))
            .addStringOption(opt => opt.setName("host").setDescription("RCON host").setRequired(true))
            .addIntegerOption(opt => opt.setName("port").setDescription("RCON port").setRequired(true))
            .addStringOption(opt => opt.setName("password").setDescription("RCON password").setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName("remove")
            .setDescription("Remove a server config")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel to unlink").addChannelTypes(ChannelType.GuildText).setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName("list")
            .setDescription("List all configured servers")
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!isAdmin(interaction)) {
        await interaction.reply({ content: "❌ You don't have permission to use this command.", flags: MessageFlags.Ephemeral });
        return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case "add": {
            const name = interaction.options.getString("name", true);
            const channel = interaction.options.getChannel("channel", true);
            const host = interaction.options.getString("host", true);
            const port = interaction.options.getInteger("port", true);
            const password = interaction.options.getString("password", true);

            setServer({ name, channelId: channel.id, rconHost: host, rconPort: port, rconPassword: password });
            await interaction.reply({ content: `✅ Server **${name}** linked to <#${channel.id}>`, flags: MessageFlags.Ephemeral });
            break;
        }
        case "remove": {
            const channel = interaction.options.getChannel("channel", true);
            const removed = removeServer(channel.id);
            await interaction.reply({
                content: removed ? `✅ Server unlinked from <#${channel.id}>` : `❌ No server linked to that channel.`,
                ephemeral: true
            });
            break;
        }
        case "list": {
            const servers = getServers();
            await interaction.reply({
                content: servers.length > 0
                    ? servers.map(s => `**${s.name}**: <#${s.channelId}> → \`${s.rconHost}:${s.rconPort}\``).join("\n")
                    : "No servers configured.",
                ephemeral: true
            });
            break;
        }
    }
}
