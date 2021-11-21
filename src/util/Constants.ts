import { ApplicationCommandPermissionData, IntentsString } from "discord.js";

import DiscordClient from "../client/DiscordClient";

export const ClientIntents: IntentsString[]  = [
    'GUILDS', 'GUILD_BANS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'
]


export const AdminRolePermissionData = (client: DiscordClient): ApplicationCommandPermissionData[] => {return [
    {id: client.config.roles.member, type: 1, permission: false}, //! Member
    {id: client.config.roles.mod, type: 1, permission: false}, //! Mod
    {id: client.config.roles.trainee, type: 1, permission: false}, //! Trainee
    {id: client.config.roles.admin, type: 1, permission: true}, //! Admin
    
]}

export const ModRolePermissionData = (client: DiscordClient): ApplicationCommandPermissionData[] => {return [
    {id: client.config.roles.member, type: 1, permission: false}, //! Member
    {id: client.config.roles.mod, type: 1, permission: true}, //! Mod
    {id: client.config.roles.trainee, type: 1, permission: true}, //! Trainee
    {id: client.config.roles.admin, type: 1, permission: true}, //! Admin
]}

export type RolePermission = 'MOD' | 'ADMIN' | 'USER'

export enum Colors {
    INFO = '#cbdbfe',
    LOADED = '#187bcd',
    LOADING = '#03254C',
    ERROR = '#992D22',
    LOG = '#7289DA',
    GLURPLE = '#8d6afe',
    WARNING = '#eed202'
}