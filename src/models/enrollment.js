'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student'
      });

      Enrollment.belongsTo(models.CourseGroup, {
        foreignKey: 'course_group_id',
        as: 'courseGroup'
      });
    }
  }

  Enrollment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    course_group_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Enrollment',
    tableName: 'Enrollments',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'course_group_id'],
        name: 'idx_enrollment_unique'
      },
      {
        fields: ['status'],
        name: 'idx_enrollments_status'
      },
      {
        fields: ['enrollment_date'],
        name: 'idx_enrollments_date'
      }
    ]
  });

  return Enrollment;
};
