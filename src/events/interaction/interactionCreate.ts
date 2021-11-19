import chalk from "chalk";
import { Interaction } from "discord.js";
import DiscordClient from "../../client/DiscordClient";
import Event from "../../structure/Event";
import Handler from "../../util/Handler";

export default class InteractionCreateEvent extends Event {
    eventName = 'interactionCreate'

    async run(client: DiscordClient, interaction: Interaction) {
        let interactionType: "component" | "button" | "command" | "menu" = "component";
        if(interaction.isMessageComponent()) interactionType = 'component'
        if(interaction.isButton()) interactionType = 'button';
        if(interaction.isSelectMenu()) interactionType = 'menu';
        if(interaction.isCommand()) interactionType = 'command';
        client.emit('debug', (chalk.green(`[DEV] `) + chalk.blueBright(`An interaction of type ${interactionType} has been used!`)) )
        await Handler.validateInteractionType(client, interaction, interactionType);
    }
}