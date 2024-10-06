module.exports=(sequelize,DataTypes,Model)=>{

    class Token extends Model {}

    Token.init({
        device_id:{
            type: DataTypes.STRING,
            
        },
        device_type:{
            type: DataTypes.STRING,
        },
        device_token:{
            type: DataTypes.STRING,
        },
        tokenVersion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
        userid:{
            type: DataTypes.INTEGER,
            references: {
                model: 'tbl_User',
                key: 'id',
                onDelete: 'CASCADE'
        }
        }        
    },{
        sequelize, 
        modelName: 'Token',
        tableName: 'tbl_Token',

    });

    return Token;

}