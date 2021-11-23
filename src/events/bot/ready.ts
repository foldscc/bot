import chalk from "chalk";
import Util  from "../../util/Util";
import DiscordClient from "../../client/DiscordClient";
import Event from "../../structure/Event";

export default class ReadyEvent extends Event {
    eventName = 'ready'

    async run(client: DiscordClient) {
        client.erela.init(client?.user?.id)
        console.log(chalk.green(`${client.user!.tag} is now ready.`))
        await Util.publishCommands(client)
    }
}