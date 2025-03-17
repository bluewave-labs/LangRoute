module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    virtualKey: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Define any associations here
  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
