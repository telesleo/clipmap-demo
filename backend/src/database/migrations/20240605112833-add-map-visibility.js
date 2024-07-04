'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('maps', 'visibility', {
      type: Sequelize.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'private',
    });
  },

  async down(queryInterface) {
    queryInterface.removeColumn('maps', 'visibility');
  },
};
