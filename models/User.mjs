import { DataTypes } from 'sequelize';
import db from '../db/conn.mjs';

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    occupation: {
        type: DataTypes.STRING,
        required: true,
    },
    newsletter: {
        type: DataTypes.BOOLEAN,
    }
});

export default User;