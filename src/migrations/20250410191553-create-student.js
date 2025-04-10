'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      ra: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Registro Acadêmico',
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true,
        comment: 'CPF sem pontuação',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    });
    await queryInterface.addIndex('Students', ['ra'], {
      name: 'idx_students_ra'
    });
    await queryInterface.addIndex('Students', ['cpf'], {
      name: 'idx_students_cpf'
    });
    await queryInterface.addIndex('Students', ['email'], {
      name: 'idx_students_email'
    });
    await queryInterface.addIndex('Students', ['created_at'], {
      name: 'idx_students_created_at'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  }
};
