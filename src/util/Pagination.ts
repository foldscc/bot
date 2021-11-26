import { MessageEmbed, MessageReaction, User } from 'discord.js';
import { CommandInteraction } from 'discord.js';
const EMOJIS = ['⏪', '⬅️', '🚫', '➡️', '⏩'];
export interface PaginationPayload {
    pages: Array<MessageEmbed>;
    embed: MessageEmbed;
    edit(index: number, embed: MessageEmbed, page: MessageEmbed): void
}
export class Pagination {
    interaction: CommandInteraction;
    payload: PaginationPayload;
    constructor(interaction: CommandInteraction, payload: PaginationPayload) {
      this.interaction = interaction;
      this.payload = payload;
    }
  
    async start() {
      const { embed } = this.payload;
      const { pages } = this.payload;
      let index = 0;
      if(!this.interaction.channel) return;
      this.payload.edit.call(this, index, embed, pages[index]);
      const msg = await this.interaction.channel.send({ embeds: [embed] });
      if (pages.length < 2) return undefined;
      for (const emoji of EMOJIS) await msg.react(emoji);
      const filter = (m: MessageReaction, user: User) => EMOJIS.includes(m.emoji.name!) && user.id === this.interaction.user.id;
      while (true) {
        const responses = await msg.awaitReactions({ filter, max: 1, time: 50000 });
        
        if (!responses?.size) break;
        const emoji = responses.first()?.emoji?.name;
        
        if (emoji === EMOJIS[0]) index -= 5;
        else if (emoji === EMOJIS[1]) index--;
        else if (emoji === EMOJIS[3]) index++;
        else if (emoji === EMOJIS[4]) index += 5;
        else {
          msg.reactions.removeAll();
          break;
        }
        index = ((index % pages.length) + pages.length) % pages.length;
        await responses.first()?.users.remove(this.interaction.user.id)
        this.payload.edit.call(this, index, embed, pages[index]);
        await msg.edit({ embeds: [embed] });
      }
    }
  };
  