import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite',
})

sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
})

sequelize.define('Module', {
  id: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  name: DataTypes.TEXT,
  description: DataTypes.TEXT,
  version: DataTypes.TEXT,
  author: DataTypes.TEXT,
  configuration: DataTypes.JSON,
})

export default sequelize
