import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('dsw_agro_db', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
