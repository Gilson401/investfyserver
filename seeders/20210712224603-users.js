'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    //   Add seed commands here.
    //    Example:
     
       await queryInterface.bulkInsert('users', [{
        name: 'John Doe',
        email: 'test@medium.com',
        password: 'a12345678'
      }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('users', null, {});
     
  }
};
