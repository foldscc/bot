import { SlashCommandBuilder } from "@discordjs/builders";

export default abstract class Command {
    abstract commandName: string;
    abstract commandDescription: string;
    data?: SlashCommandBuilder; 
    devOnly?: boolean;

    
    getData() {
        return this.data?.toJSON()
    }
    
}



