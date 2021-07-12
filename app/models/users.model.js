module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        
      email: { type: Sequelize.STRING, allowNull: false   },
      name: { type: Sequelize.STRING, allowNull: false, },
    //   created_at: {  type: Sequelize.DATE, allowNull: true, },
    //   updated_at: {  type: Sequelize.DATE,  allowNull: true, },
      password: {   type: Sequelize.STRING, allowNull: false,  }
    }
    ,
    {   // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,       
     }
      
      );
  
    return User;
  };