import { STRING, INTEGER, BOOLEAN } from 'sequelize';

import Client from'../client/SequelizeClient'
const Player = Client.define('player', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        
    },
    discordId: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    ign: {
        type: STRING,
        unique: true,
        allowNull: false
    },
    uuid: {
        type: STRING,
        unique: true,
        allowNull: false
    },
    rank: {
        type: STRING,
        unique: false,
        allowNull: true,
        defaultValue: null,
    },
    guildRank: {
        type: INTEGER,
        unique: false,
        allowNull: false,
        defaultValue: 0
    },
    blocked: {
        type: BOOLEAN,
        defaultValue: false,
    }
})

Client.sync()
export default Player;