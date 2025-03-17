module.exports = (sequelize, DataTypes) => {
  const APILog = sequelize.define('APILog', {
    requestId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requestTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    responseTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Define any associations here
  APILog.associate = function(models) {
    // associations can be defined here
  };

  return APILog;
};
