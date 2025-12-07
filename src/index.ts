import { Client, GatewayIntentBits, Events, REST, Routes, Collection } from "discord.js";

// Import commands
import * as listCmd from "./commands/list.js";
import * as tpsCmd from "./commands/tps.js";
import * as packsCmd from "./commands/packs.js";
import * as setpackCmd from "./commands/admin/setpack.js";
import * as setserverCmd from "./commands/admin/setserver.js";
import {config} from "./config.js";

const commands = [listCmd, tpsCmd, packsCmd, setpackCmd, setserverCmd];

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

async function registerCommands() {
    const rest = new REST().setToken(config.DISCORD_TOKEN);

    try {
        console.log("🔄 Registering slash commands...");
        await rest.put(
            Routes.applicationCommands(config.DISCORD_CLIENT_ID),
            { body: commands.map(cmd => cmd.data.toJSON()) }
        );
        console.log("✅ Slash commands registered!");
    } catch (error) {
        console.error("❌ Error registering commands:", error);
    }
}

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`✅ Bot is online as ${readyClient.user.tag}`);
    await registerCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(cmd => cmd.data.name === interaction.commandName);

    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            const reply = { content: "❌ An error occurred.", ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    }
});

client.login(config.DISCORD_TOKEN);
