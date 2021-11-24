const Sequelize = require('sequelize');

module.exports = class Forum extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            forumName:{
                type : Sequelize.STRING(100),
                allowNull: true,
            },
            forumDate:{
                type : Sequelize.STRING(100),
                allowNull: true,
            },
            forumPlace:{
                type : Sequelize.STRING(100),
                allowNull: true,
            },
            forumHost:{
                type : Sequelize.STRING(100),
                allowNull: true,
            },
            forumCount:{
                type : Sequelize.INTEGER,
                allowNull : true,
                defaultValue: 0,
            },
            forummyCount:{
                type : Sequelize.INTEGER,
                allowNull : true,
                defaultValue: 0,
            },
          
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'Fourm',
            tableName : 'forums',
            paranoid : true,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
     }
 
     static associate(db) {}
 };