
module.exports = (sequelize, DataTypes, Model) => {

    class User extends Model { }

    User.init({
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
        },
        otp: {
            type: DataTypes.INTEGER
        },
        is_verify: {
            type: DataTypes.TINYINT
        },
        is_account_setup: {
            type: DataTypes.TINYINT,

        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING,
        },
        lastname: {
            type: DataTypes.STRING,
        },
        iso_code: {
            type: DataTypes.STRING,
        },
        country_code: {
            type: DataTypes.STRING,
        },
        phone_no: {
            type: DataTypes.BIGINT,
        },
        otp_created_at: {
            type: DataTypes.DATE
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'tbl_User',
    });

    return User;
}