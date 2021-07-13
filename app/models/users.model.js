module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        
      email: { type: Sequelize.STRING, allowNull: false   },
      name: { type: Sequelize.STRING, allowNull: false, },
       password: {   type: Sequelize.STRING, allowNull: false,  }
    }
    ,
    {  
        timestamps: false,       
     }
      
      );
  
    return User;
  };