module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        
      email: {
        type: Sequelize.STRING
      },
      name:{ type: Sequelize.STRING, allowNull: false, },
      created_at:{  type: Sequelize.DATE, allowNull: false, },
      updated_at:{  type: Sequelize.DATE,  allowNull: false, }
    //   senha: {
    //     type: Sequelize.STRING
    //   }
    }
    ,
    {   // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,       
     }
      
      );
  
    return User;
  };