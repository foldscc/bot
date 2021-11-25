import { Roles } from './../../util/Constants';
import { CommandInteractionOptionResolver, Guild, GuildMember } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';
import Player from '../../models/Player';
import { Ranks } from '../../util/Constants';

export default class VerifyCommand extends Command {
    commandName = 'verify'
    commandDescription = 'Zweryfikuj swoje konto Hypixel!'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true).addStringOption(option => option.setName('ign').setRequired(true).setDescription('Twoje UUID lub nazwa w grze'))

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const playerResponse = await client.hypixel.getPlayer(options.getString('ign')!).catch(() => null)
        if(userProfile?.getDataValue('blocked') === true) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Weryfikacja`, `Nie masz uprawnień by wykonać tą czynność, bo zostałeś zablokowany/a! Skontaktuj się z administratorem by omówić powód blokady i możliwe rozwiązania.`)]})
            return;
        }
        if(userProfile) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Weryfikacja`, `Twoje konto już istnieje w bazie danych! Użyj komendy \`/unverify\`, by się wyrejestrować!`)]})
            return;
        }
        
        if(!playerResponse) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Weryfikacja`, `Twoje konto nie istnieje w bazie danych kont **Hypixel** lub wystąpił błąd! Upewnij się że **napisałeś/aś** swój IGN **dobrze!**`).setImage(`https://folds.cc/images/hypixelhelp.gif`)]})
            return;
        }
        if(!playerResponse.socialMedia || !playerResponse.socialMedia.some(sMedia => sMedia.id === "DISCORD")) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Register`, `Twoje konto Hypixel nie posiada połączonego Discorda!`).setImage('https://folds.cc/images/hypixelhelp.gif')]})
            return;
        }
        const playerDiscord = playerResponse.socialMedia.filter(e => e.id === "DISCORD")[0]

        if(playerDiscord.link !== cmd.user.tag) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Register`, `Twój tag Discord, \`${cmd.user.tag}\`, nie pasuje do nazwy konta połączonego z \`${playerResponse.nickname}\` - \`${playerDiscord}\`!`).setImage('https://folds.cc/images/hypixelhelp.gif')]})
            return;
        }
        const hypixelGuild = await client.hypixel.getGuild('player', `${playerResponse.uuid}`)
        const guildUser = hypixelGuild?.members?.find(guildUser => guildUser?.uuid === playerResponse?.uuid)

        if(!guildUser || !hypixelGuild) {
            await cmd.reply({embeds: [EmbedFactory.generateErrorEmbed('Register', `Wystąpił nieznany błąd przy pobieraniu danych gildii! Administratorzy zostali o tym powiadomieni i wkrótce nawiążą z tobą kontakt.`)]})
            client.emit('adminWarn', `Wystąpił błąd przy rejestrowaniu gracza \`${playerResponse.nickname}\` - ${cmd.user.tag} - UUID nie zostało znalezione w gildii!`, guildUser, hypixelGuild, `Guild name: ${hypixelGuild.name}`)
            return;
        }
        if(hypixelGuild.id !== "60a951028ea8c9bb7f6da1bb") {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Register`, `Nie możesz się zweryfikować, ponieważ nie jesteś w naszej gildii! Dołącz do niej przed kontynuowaniem! \`(/g join Folds)\``)]})
            return;
        }
        await Player.create({
            discordId: cmd.user.id,
            ign: playerResponse.nickname,
            uuid: playerResponse.uuid,
            //@ts-ignore
            rank: Ranks[`${playerResponse.rank}`],
            //@ts-ignore
            guildRank: Roles[`${guildUser.rank}`],
            blocked: false

        })
        //@ts-ignore
        const member = cmd.member as GuildMember
        
        const isNicknameSet = await member.setNickname(`${playerResponse.nickname}${member.user.username.toLowerCase() === playerResponse.nickname.toLowerCase() ? '.' : ''}`).catch(err => null)
        if(!isNicknameSet) {
            const channel = guild.channels.cache.get(client.config.channels.error)!
            if(channel?.isText()) {
                channel.send({embeds: [EmbedFactory.generateErrorEmbed(`Uwaga`, `Osobie o nicku ${playerResponse.nickname} (<@${member.id}>) nie został przydzielony nick, ponieważ permisje są niewystarczające!`)]})
            }
        }


        
        cmd.reply({embeds: [EmbedFactory.generateRandomColorEmbed(`<a:f_Verified:849747695253323786> - Zweryfikowano!`, `Sukces! Pomyślnie zweryfikowano twoje konto, połączono je z \`${playerResponse.nickname}\`! Zaraz zostanie przyznany Ci dostęp do kategorii gildyjnej!`).setImage(`https://crafatar.com/renders/head/${playerResponse.uuid}`)]})

    }
}