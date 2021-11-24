const Sequelize = require('sequelize');

// 인적사항 아이디 비밀번호 주소 이름 성별 생년월일 핸드폰

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.STRING(40),
                alowNull: true,
                unique: true,
            },
            userPwd: {
                type: Sequelize.STRING(100),
                alowNull: true,
            },
            userName: {
                type: Sequelize.STRING(50),
                alowNull: true,
            },
            nick: {
                type: Sequelize.STRING(50),
                alowNull: true,
            },
            userDate: {
                type: Sequelize.DATE, //날짜
                alowNull: true,
                defaultValue: sequelize.NOW,
            },
            postcode: {
                type: Sequelize.INTEGER,
                alowNull: true,
            },
            address: {
                type: Sequelize.STRING(100),
                alowNull: true,
            },
            detailAddress: {
                type: Sequelize.STRING(100),
                alowNull: true,
            },
            extraAddress: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            userTel: {
                type: Sequelize.INTEGER, //정수
                allowNull: true,
            },
            userMail: {
                type: Sequelize.STRING(100),
                alowNull: true,
            },
            userGender: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            token: {
                type: Sequelize.STRING(100),
                allowNull : true,
            },
            
            
            //카카오 사용시 provider가 local이면 로컬로그인 한것 ,kakao면 kakao로그인한것
            provider: {
                type: Sequelize.STRING(10),
                alowNull: false,
                defaultValue: "local",
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.User.hasOne(db.Profile, { foreignKey: 'Administrator',sourceKey: 'userId'});

        db.User.hasMany(db.Notice, {
            foreignKey: 'Administrator',
            sourceKey: 'id'
        });
        db.User.hasMany(db.Noticeboard, {
            foreignKey: 'Writer',
            sourceKey: 'id'
        });
    }
};
