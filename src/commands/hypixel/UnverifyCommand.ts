
import { CommandInteractionOptionResolver, Guild, GuildMember,  } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';
import Player from '../../models/Player';


export default class UnverifyCommand extends Command {
    commandName = 'unverify'
    commandDescription = 'Cofnij weryfikację konta!'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true)

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        if(!userProfile) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Cofnięcie weryfikacji`, `Twoje konto nie istnieje w bazie danych! Użyj komendy \`/verify\`, by  się zarejestrować!`)]})
            return;
        }
        if(userProfile?.getDataValue('blocked') === true) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Cofnięcie weryfikacji`, `Nie masz uprawnień by wykonać tą czynność, bo zostałeś zablokowany/a! Skontaktuj się z administratorem by omówić powód blokady i możliwe rozwiązania.`)]})
            return;
        }

        const res = await Player.destroy({where: {
            discordId: cmd.user.id
        }})
        if(res === 0) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Cofnięcie weryfikacji`, `Nie masz uprawnień by wykonać tą czynność, bo zostałeś zablokowany/a! Skontaktuj się z administratorem by omówić powód blokady i możliwe rozwiązania.`)]})
            return;
        }
        const member = cmd.member as GuildMember
        
        const isNicknameSet = await member.setNickname(null).catch(err => null)
        if(!isNicknameSet) {
            const channel = guild.channels.cache.get(client.config.channels.error)!
            if(channel?.isText()) {
                channel.send({embeds: [EmbedFactory.generateErrorEmbed(`Uwaga`, `${member} nie został usunięty nick, ponieważ permisje są niewystarczające!`)]})
            }
        }
        cmd.reply({embeds: [EmbedFactory.generateRandomColorEmbed(`Cofnięcie weryfikacji`, `Twoje konto zostało pomyślnie odweryfikowane!`)]})

    }
}