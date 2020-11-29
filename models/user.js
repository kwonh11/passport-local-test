module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
