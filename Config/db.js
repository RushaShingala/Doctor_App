const {sequelize} =require('./Connection');
const {Sequleize, DataTypes ,  Model} =require('sequelize');
var db={}
db.sequelize=sequelize;
db.Sequleize=Sequleize;

console.log("this is db file");


db.User= require('../Model/user')(sequelize,DataTypes,Model);
db.Token=require('../Model/token')(sequelize,DataTypes,Model);
db.Doctor=require('../Model/doctor')(sequelize,DataTypes,Model);
db.Appointment=require('../Model/appointment')(sequelize,DataTypes,Model);
db.Slot=require('../Model/slot')(sequelize,DataTypes,Model);

// ---user-token--
db.User.hasMany(db.Token,{
    foreignKey:'userid',
})
db.Token.belongsTo(db.User,{
    foreignKey:'userid'
})

// ---user-appointment--
db.User.hasMany(db.Appointment,{
    foreignKey:'user_id',
})
db.Appointment.belongsTo(db.User,{
    foreignKey:'user_id'
})

// ---doctor--appointment
db.Doctor.hasMany(db.Appointment,{
    foreignKey:'doctor_id',
})
db.Appointment.belongsTo(db.Doctor,{
    foreignKey:'doctor_id'
})

// ---doctor--slot
db.Doctor.hasMany(db.Slot,{
    foreignKey:'doctor_id',
})
db.Slot.belongsTo(db.Doctor,{
    foreignKey:'doctor_id'
})


//--slot--appointment


db.Slot.hasMany(db.Appointment,{
    foreignKey:'slot_id',
})
db.Appointment.belongsTo(db.Slot,{
    foreignKey:'slot_id'
})

module.exports=db