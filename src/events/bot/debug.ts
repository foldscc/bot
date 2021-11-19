import DiscordClient from "../../client/DiscordClient";
import Event from "../../structure/Event";

export default class ReadyEvent extends Event {
    eventName = 'debug'

    async run(client: DiscordClient, text: string) {
        console.log(text)
    }
}