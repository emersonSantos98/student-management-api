'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const password = '@123456'; // Senha padrão para demonstração
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'Administrador',
        email: 'admin@example.com',
        password_hash: passwordHash,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Funcionário',
        email: 'staff@example.com',
        password_hash: passwordHash,
        role: 'staff',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
