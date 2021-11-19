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
    {id: '845770774073966632', type: 1, permission: false}, //! Member
    {id: '845764263738212382', type: 1, permission: true}, //! Mod
    {id: '901556109310042175', type: 1, permission: true}, //! Trainee
    {id: '845763194655998002', type: 1, permission: true}, //! Admin
]}

export type RolePermission = 'MOD' | 'ADMIN' | 'USER'
