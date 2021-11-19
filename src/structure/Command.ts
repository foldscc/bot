import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { AdminRolePermissionData, ModRolePermissionData, RolePermission } from "../util/Constants";
import client from "..";
import DiscordClient from "../client/DiscordClient";
import { CommandInteraction, CommandInteractionOptionResolver, Guild } from "discord.js";
import { Model } from "sequelize/types";
export default abstract class Command {
    abstract commandName: string;
    abstract commandDescription: string;
    data?: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder; 
    devOnly?: boolean;
    perms: RolePermission = 'USER';


    async run(client: DiscordClient, interaction: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile?: Model<any, any>, userLanguage?: any) {}

    
    getData() {
        return this.data?.setName(this.commandName).setDescription(this.commandDescription).toJSON()
    }

    getPerms() {
        return this.perms === "USER" ? false : (this.perms === "ADMIN" ? AdminRolePermissionData(client) : ModRolePermissionData(client))

    }

    getDefaultPermission() {
        return (!this.getPerms()) ? true : false
    }

    getName() {
        return this.commandName
    }
    getDescription() {
        return this.commandDescription
    }
    
}



