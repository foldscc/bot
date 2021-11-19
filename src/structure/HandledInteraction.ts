import DiscordClient from "../client/DiscordClient";


export default abstract class BaseInteraction {
    abstract listensFor: string;
    getListenedType(): string {return this.listensFor}
    abstract run(client: DiscordClient, ...args: any): void;
}

