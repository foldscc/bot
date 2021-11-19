import DiscordClient from "../client/DiscordClient"

export default class Util extends null {
    constructor() {
        throw new Error(`The class ${this.constructor.name} is not supposed to be instantiated!`)
    }   

    static publishCommands = async (client: DiscordClient) => {        
        const body = client.commands.map(k => k.getData())
        const response = await client.restAPI.put(`/applications/${client?.application?.id}/guilds/${client.config.id}/commands`, { body })

        const slashCommands = client.commands.map((cmd) => {
            if(!cmd.getPerms()) return;
            //@ts-ignore
            const apiCommand = response.find((k) => k.name === cmd.getName())

            return {
                id: apiCommand.id,
                permissions: cmd.getPerms()
            }
        }).map((el) => el)
        if(!slashCommands || slashCommands.length === 0) return;
        //@ts-ignore
        
        const res = await client.restAPI.put(`/applications/${client?.application?.id}/guilds/${client.config.id}/commands/permissions`, { body: slashCommands})
    }

    
}