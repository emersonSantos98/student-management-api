'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Student.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    ra: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Registro Acadêmico',
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      comment: 'CPF sem pontuação',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },    {
    sequelize,
    modelName: 'Student',
    tableName: 'Students',
    timestamps: false,
    underscored: true,
  });

  return Student;
};
