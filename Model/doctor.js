
module.exports = (sequelize, DataTypes, Model) => {

    class Doctor extends Model { }

    Doctor.init({
        name: {
            type: DataTypes.STRING,
        },
        specialization: {
            type: DataTypes.STRING,
        },
        profile_image: {
            type: DataTypes.STRING
        },
        about: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Doctor',
        tableName: 'tbl_Doctor',
    });

    return Doctor;
}