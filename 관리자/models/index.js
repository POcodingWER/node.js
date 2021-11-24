const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// DB선언
const User = require('./user');
const Profile = require('./profile');

const Notice = require('./notice');
const Noticeboard = require('./noticeboard');
const Forum = require('./forum');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);


db.sequelize = sequelize;
// db.Sequelize = Sequelize;

db.User = User;
db.Profile = Profile;
db.Notice = Notice;
db.Noticeboard = Noticeboard;
db.Forum = Forum;


User.init(sequelize);
Profile.init(sequelize);
Notice.init(sequelize);
Noticeboard.init(sequelize);
Forum.init(sequelize);

User.associate(db);
Profile.associate(db);
Notice.associate(db);
Noticeboard.associate(db);
Forum.associate(db);

module.exports = db;
