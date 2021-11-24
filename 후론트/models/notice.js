const Sequelize = require('sequelize');

module.exports = class Notice extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            noticeName:{
                type: Sequelize.STRING(100),
                allowNull : true,
            },
            noticeBody: {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            noticeCount:{
                type : Sequelize.INTEGER,
                allowNull : true,
                defaultValue: 0,
            },
            noticemyCount:{
                type : Sequelize.INTEGER,
                allowNull : true,
                defaultValue: 0,
            },
       }, {
           sequelize,
           timestamps : true,
           underscored : false,
           modelName : 'Notice',
           tableName : 'notices',
           paranoid : true,
           charset : 'utf8mb4',
           collate : 'utf8mb4_general_ci',
       });
    }

    static associate(db) { 
        db.Notice.belongsTo(db.User, { foreignKey : 'Administrator', targetKey : 'id' });
       }
};