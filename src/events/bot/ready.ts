import chalk from "chalk";
import Util  from "../../util/Util";
import DiscordClient from "../../client/DiscordClient";
import Event from "../../structure/Event";

export default class ReadyEvent extends Event {
    eventName = 'ready'

    async run(client: DiscordClient) {
        
        console.log(chalk.green(`${client.user!.tag} is now ready.`))
        console.log(client.commands.map(k => k.getData()))
        await Util.publishCommands(client)
    }
}