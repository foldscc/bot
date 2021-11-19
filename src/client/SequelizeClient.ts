import chalk from 'chalk';
import { Sequelize } from 'sequelize';
import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USERNAME } from '../config/auth.dev.json'
const SequelizeClient = new Sequelize((process.env.MYSQL_DATABASE ?? MYSQL_DATABASE), (process.env.MYSQL_USERNAME ?? MYSQL_USERNAME), (process.env.MYSQL_PASSWORD ?? MYSQL_PASSWORD), {
    host: process.env.MYSQL_HOST ?? MYSQL_HOST,
    database: process.env.MYSQL_DATABASE ?? MYSQL_DATABASE,
    dialect: 'mysql',
    logging: (sqlContent: string, sqlTiming: number | undefined) => console.log(chalk.cyan(`MySQL: ${chalk.green(sqlContent)} \nat timing ${sqlTiming}`))
})

export default SequelizeClient