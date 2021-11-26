
import { CommandInteractionOptionResolver, Guild } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';
import Util from '../../util/Util';
import { Pagination } from '../../util/Pagination';


export default class QueueCommand extends Command {
    commandName = 'queue'
    commandDescription = 'Zobacz obecną kolejkę'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true)

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const guildPlayers = client.erela.players.get(guild.id)
        if(!guildPlayers) {
            cmd.reply({embeds: [EmbedFactory.generateWarningEmbed(`Music 🎵`, `Nic nie jest teraz odtwarzane!`)]})
            return;     
        }

        
        if(guildPlayers?.queue?.size < 1) {
            
        }
        const pages = Util.chunk(guildPlayers.queue.map((track, index) => `\`${index + 1}\` ${track.title} [dodane przez ${track.requester}]`), 7);
        const embed = EmbedFactory.generateRandomColorEmbed(`${guild.name} - Kolejka`, `\u200b`)
        await new Pagination(cmd, {
            pages,
            embed,
            edit: (index, emb, page: any) => emb.setDescription(Array.isArray(page) ? page.join('\n') : page).setFooter(`© 2021 - Folds 🎉 | Strona ${index + 1}/${pages.length}`).setTimestamp()
        }).start()



        
    }
}