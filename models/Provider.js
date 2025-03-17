module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define('Provider', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiBase: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiVersion: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Define any associations here
  Provider.associate = function(models) {
    // associations can be defined here
  };

  return Provider;
};
