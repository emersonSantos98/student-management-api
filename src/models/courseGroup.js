'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CourseGroup extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CourseGroup.hasMany(models.Enrollment, {
                foreignKey: 'course_group_id',
                as: 'enrollments'
            });
        }
    }
    CourseGroup.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        max_students: {
            type: DataTypes.INTEGER,
            comment: '0 = unlimited'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        sequelize,
        modelName: 'CourseGroup',
        tableName: 'CourseGroups',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                name: 'idx_classes_start_date',
                fields: ['start_date']
            },
            {
                name: 'idx_classes_end_date',
                fields: ['end_date']
            }
        ]
    });
    return CourseGroup;
};
