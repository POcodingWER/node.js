const Sequelize = require('sequelize');

// 인적사항 아이디 비밀번호 주소 이름 성별 생년월일 핸드폰

module.exports = class Profile extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            skill: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            work: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            companyName: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            divisionName: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            workstart: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            workend: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            experience: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            age: {
                type: Sequelize.INTEGER, //정수
                allowNull: true,
            },
            userTel: {
                type: Sequelize.INTEGER, //정수
                allowNull: true,
            },
            userName: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
           
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Profile',
            tableName: 'profiles',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Profile.belongsTo(db.User, { foreignKey : 'Administrator', targetKey : 'userId' });
    }
};