import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'user', 'password', {

    host: 'localhost',
    dialect: 'mysql',

});

export default sequelize;