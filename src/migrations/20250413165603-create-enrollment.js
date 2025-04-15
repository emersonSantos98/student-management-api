'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Enrollments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      course_group_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'CourseGroups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enrollment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      status: {
        type: Sequelize.ENUM('active', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });

    // Adding indexes
    await queryInterface.addIndex('Enrollments', ['student_id', 'course_group_id'], {
      unique: true,
      name: 'idx_enrollment_unique'
    });

    await queryInterface.addIndex('Enrollments', ['status'], {
      name: 'idx_enrollments_status'
    });

    await queryInterface.addIndex('Enrollments', ['enrollment_date'], {
      name: 'idx_enrollments_date'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Enrollments');
  }
};
