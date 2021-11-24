const Sequelize = require('sequelize');

module.exports = class Noticeboard extends Sequelize.Model {
 

//  게시물 작성자
//  게시판 분류
//  게시물 이름
//  게시물 내용

// 업로드, 스타일 등은 타 테이블을 만들어서 연결해야할듯
// 댓글은 나중에 추가
// 게시물 시간
    static init(sequelize) {
        return super.init({
            boardCategory: {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            boardName: {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            boardBody: {
                type : Sequelize.STRING(1000),
                allowNull : true,
                defaultValue: 0,
            },
            boardCount:{
                type : Sequelize.INTEGER,
                allowNull : true,
                defaultValue: 0,
            },
            boardmyCount:{
                type : Sequelize.INTEGER,
                allowNull : true,
                defaultValue: 0,
            },
       }, {
           sequelize,
           timestamps : true,
           underscored : false,
           modelName : 'Noticeboard',
           tableName : 'noticeboards',
           paranoid : true,
           charset : 'utf8mb4',
           collate : 'utf8mb4_general_ci',
       });
    }

    static associate(db) { 
        db.Noticeboard.belongsTo(db.User, { foreignKey : 'Writer', targetKey : 'id' });
       }
};