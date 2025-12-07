import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { setPack, removePack, getPacks } from "../../utils/dataManager.js";
import { isAdmin } from "../../utils/permissions.js";
import { MessageFlags } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("setpack")
    .setDescription("Manage modpack versions (Admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
        sub.setName("add")
            .setDescription("Add or update a modpack")
            .addStringOption(opt => opt.setName("name").setDescription("Pack name").setRequired(true))
            .addStringOption(opt => opt.setName("version").setDescription("Pack version").setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName("remove")
            .setDescription("Remove a modpack")
            .addStringOption(opt => opt.setName("name").setDescription("Pack name").setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName("list")
            .setDescription("List all modpacks")
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
            const version = interaction.options.getString("version", true);
            setPack(name, version);
            await interaction.reply({ content: `✅ Pack **${name}** set to version \`${version}\``, flags: MessageFlags.Ephemeral });
            break;
        }
        case "remove": {
            const name = interaction.options.getString("name", true);
            const removed = removePack(name);
            await interaction.reply({
                content: removed ? `✅ Pack **${name}** removed.` : `❌ Pack **${name}** not found.`,
                ephemeral: true
            });
            break;
        }
        case "list": {
            const packs = getPacks();
            await interaction.reply({
                content: packs.length > 0
                    ? packs.map(p => `**${p.name}**: \`${p.version}\``).join("\n")
                    : "No packs configured.",
                ephemeral: true
            });
            break;
        }
    }
}
