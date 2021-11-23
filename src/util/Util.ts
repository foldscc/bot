import DiscordClient from "../client/DiscordClient"

export default class Util extends null {
    constructor() {
        throw new Error(`The class ${this.constructor.name} is not supposed to be instantiated!`)
    }   

    

    static getRandomEnumValue = (enumeration: any) => {
        const values = Object.keys(enumeration)
        const enumKey = values[Math.floor(Math.random() * values.length)];
        //@ts-ignore
        return enumeration[enumKey];


    }

    static deleteFromObject = (obj: any ) => {
        delete obj.options;
        return obj;
    }

    static publishCommands = async (client: DiscordClient) => {        
        const body = client.commands.map(k => k.getData()).map((val) => val?.options?.length === 0 ? this.deleteFromObject(val) : val)
        
        
        const response = await client.restAPI.put(`/applications/${client?.application?.id}/guilds/${client.config.id}/commands`, { body })

        const slashCommands = client.commands.map((cmd) => {
            if(!cmd.getPerms()) return;
            
            //@ts-ignore
            const apiCommand = response.find((k) => k.name === cmd.getName())

            return {
                id: apiCommand.id,
                permissions: cmd.getPerms()
            }
        }).filter(el => el)
        
        if(!slashCommands || slashCommands.length === 0) return;
        //@ts-ignore
        
        const res = await client.restAPI.put(`/applications/${client?.application?.id}/guilds/${client.config.id}/commands/permissions`, { body: slashCommands})
    }

    
}