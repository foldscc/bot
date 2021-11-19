import {STRING, INTEGER, } from 'sequelize';

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
    }
})

Client.sync()
export default Player;