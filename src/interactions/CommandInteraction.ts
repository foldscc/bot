
import { CommandInteraction } from "discord.js";
import DiscordClient from "../client/DiscordClient";
import Player from "../models/Player";
import HandledInteraction from "../structure/HandledInteraction";
import EmbedFactory from "../util/EmbedFactory";

export default class CommandInteractionHandler extends HandledInteraction {
    listensFor = 'command';
    
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const command = client.commands.get(interaction.commandName);
        if(!command) return;
        if((!interaction.channel || interaction?.channel.type === "DM") && !command.dmAllowed) {
            interaction.reply({embeds: [EmbedFactory.generateErrorEmbed(`Użycie komendy`, `Komenda \`${command.getName()}\` nie może być używana w wiadomościach prywatnych!`)]})
            return;
        }
        if(command?.devOnly && interaction.user.id !== "304263386588250112") {
            interaction.reply({embeds: [EmbedFactory.generateErrorEmbed(`Użycie komendy`, `Komenda \`${command.getName()}\` może zostać użyta tylko przez dewelopera!`)]})
            return;
        }
        const guild = client.guilds.cache.get(client.config.id) || await client.guilds.fetch(client.config.id)
        const interactionUserProfile = await Player.findOne({where: {discordId: interaction.user.id}})
        
        try {

            command.run(client, interaction, interaction.options, guild, interactionUserProfile)
        } catch (err) {
            client.emit('adminWarn', `Wystąpił błąd: ${err.name}`, err)
            if(interaction.replied) {
                interaction.editReply({embeds: [EmbedFactory.generateErrorEmbed(`Użycie komendy`, `Wystąpił nieznany błąd!`)]})
                return;
            }
            interaction.reply({embeds: [EmbedFactory.generateErrorEmbed(`Użycie komendy`, `Wystąpił nieznany błąd!`)]})
        }

    }
}