
module.exports = (sequelize, DataTypes, Model) => {

    class Appointment extends Model { }

    Appointment.init({

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tbl_User',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        doctor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tbl_Doctor',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        slot_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tbl_Slot',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        date: {
            type: DataTypes.DATEONLY,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue:'confirmed'
        },
    }, {
        sequelize,
        modelName: 'Appointment ',
        tableName: 'tbl_Appointment',

    });

    return Appointment;

}