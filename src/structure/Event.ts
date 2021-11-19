import DiscordClient from "../client/DiscordClient";


export default abstract class Event {
    abstract eventName: string;
    getName(): string {return this.eventName}
    abstract run(client: DiscordClient, ...args: any): void;
}
