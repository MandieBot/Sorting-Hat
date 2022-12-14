// **note: student is user, which is created when user signs up
// requirements, consistent among all models (besides index)
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

//
class Student extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}

// Student.init => id, first_name, last_name, email, password, house
Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        len: [6],
      },
    },
    house_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "house",
        key: "id",
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "teacher",
        key: "id",
      },
    },
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
    },
    // **on the Student.js model, do we need lines 67-71 commented back in?
    // defaultScope: {
    //   attributes: {
    //     exclude: ["password"],
    //   },
    // },

    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "student",
  }
);

module.exports = Student;
