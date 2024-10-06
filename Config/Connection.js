require('dotenv').config();
const {Sequelize, DataTypes ,  Model} =require('sequelize');
console.log("this is in connection file");
const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});

console.log("this is out  connection file");

module.exports={sequelize}