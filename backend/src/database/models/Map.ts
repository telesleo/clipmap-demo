import sequelize, { Model } from 'sequelize';
import db from '.';
import User from './User';

export default class Map extends Model {
  declare id?: string;
  declare data: string;
  declare userId: string;
  declare visibility: string;
  declare createdAt?: string;
  declare updatedAt?: string;
}

Map.init(
  {
    id: {
      type: sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.UUIDV4,
    },
    data: {
      type: sequelize.TEXT('medium'),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: sequelize.STRING,
      allowNull: false,
    },
    visibility: {
      type: sequelize.ENUM('private', 'public'),
      defaultValue: 'private',
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
    tableName: 'maps',
    underscored: true,
    timestamps: true,
  },
);

Map.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Map, {
  foreignKey: 'userId',
  as: 'maps',
});
