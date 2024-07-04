import sequelize, { Model } from 'sequelize';
import db from '.';

export default class User extends Model {
  declare id?: string;
  declare email: string;
  declare name: string;
  declare profilePictureUrl: string;
  declare createdAt?: string;
  declare updatedAt?: string;
}

User.init(
  {
    id: {
      type: sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
    },
    profilePictureUrl: {
      type: sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: sequelize.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'users',
    underscored: true,
    timestamps: true,
  },
);
