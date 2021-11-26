import { MessageEmbed } from "discord.js"
import { Colors } from "./Constants"

export default class EmbedFactory {
    constructor() {
        throw new Error(`The class ${this.constructor.name} is not supposed to be instantiated!`)
    }
    
    static generateErrorEmbed(title: string, error: string): MessageEmbed {
        return new MessageEmbed()
            .setTitle(`⛔ - ${title}`)
            .setDescription(error)
            .setColor(Colors.ERROR)
            .setFooter("© 2021 - Folds 🎉")
            .setTimestamp()
    }

    static generateWarningEmbed(title: string, warning: string): MessageEmbed {
        return new MessageEmbed()
            .setTitle(`⚠️ - ${title}`)
            .setDescription(warning)
            .setColor(Colors.WARNING)
            .setFooter("© 2021 - Folds 🎉")
            .setTimestamp()

    }

    static generateInfoEmbed(title: string, description: string): MessageEmbed {
        return new MessageEmbed()
            .setTitle(`${title}`)
            .setDescription(description)
            .setTimestamp()
            .setColor(Colors.INFO)
            .setFooter("© 2021 - Folds 🎉")
    }

    static generateRandomColorEmbed(title: string, description: string): MessageEmbed {
        return new MessageEmbed()
            .setTitle(`💥 - ${title}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter("© 2021 - Folds 🎉")
            .setColor('RANDOM')
    }

    static generateLoadingEmbed(isLoaded: boolean = false, title: string, description: string): MessageEmbed {
        return new MessageEmbed()
            .setTitle(`${isLoaded ? title : `<a:f_Loadingbuffering:845825240193171486> Loading - ${title}`}`)
            .setDescription(description)
            .setFooter("© 2021 - Folds 🎉")
            .setTimestamp()
            .setColor(isLoaded ? Colors.LOADING : Colors.LOADED)

    }



}