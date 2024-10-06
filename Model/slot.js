
module.exports = (sequelize, DataTypes, Model) => {

    class Slot extends Model { }

    Slot.init({
        slot_date: {
            type: DataTypes.DATEONLY,
        },
        start_time: {
            type: DataTypes.TIME,
        },
        end_time: {
            type: DataTypes.TIME,
        },
        doctor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tbl_Doctor',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        status: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        modelName: 'Slot',
        tableName: 'tbl_Slot',

    });

    return Slot;

}