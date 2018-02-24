module.exports = function(sequelize, app) {
    const Helper = require('../libs/helper');
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const config = app.get('config');
    const tableName = config.database.table_prefix + 'user';

    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        groupid: {
            type: Sequelize.SMALLINT(3),
            defaultValue: 0,
        },
        fullname: {
            type: Sequelize.STRING(50),
            defaultValue: '',
        },
        avatar: {
            type: Sequelize.STRING(128),
            defaultValue: '',
        },
        email: {
            type: Sequelize.STRING(50),
            defaultValue: '',
        },
        phone: {
            type: Sequelize.STRING(20),
            defaultValue: '',
        },
        address: {
            type: Sequelize.STRING(255),
            defaultValue: '',
        },
        gender: {
            type: Sequelize.SMALLINT(1),
            defaultValue: 0,
        },
        birthday: {
            type: Sequelize.DATE,
            defaultValue: '',
        },
        activationcode: {
            type: Sequelize.STRING(32),
            defaultValue: '',
        },
        status: {
            type: Sequelize.SMALLINT(2),
            defaultValue: 0,
        },
        creatorid: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        datecreated: {
            type: Sequelize.INTEGER(10),
            defaultValue: Math.round(+new Date()/1000),
        },
        datemodified: {
            type: Sequelize.INTEGER(10),
            defaultValue: 0,
            set(val) {
                console.log('datemodified: ' + val);
                return val;
            }
        },
        datelastlogin: {
            type: Sequelize.INTEGER(10),
            defaultValue: 0,
        },
    }, {
        tableName: tableName,
        timestamps: true,
        createdAt: 'datecreated',
        updatedAt: 'datemodified',
        engine: 'MYISAM',
    });

    User.STATUS_ENABLED = 1;
    User.STATUS_DISABLED = 3;

    User.GENDER_MALE = 1;
    User.GENDER_FEMALE = 3;

    User.GROUP_ADMIN = 1;
    User.GROUP_EDITOR = 3;
    User.GROUP_MEMBER = 5;

    // Expansion Model
    User.updateFromSession = async function(session) {
        const uid = session.uid;

        const myUser = await User.findById(uid);

        session.fullname = myUser.fullname;
        session.email = myUser.email;
        session.groupid = parseInt(myUser.groupid);
    };

    User.buildConditions = function(query) {
        let hasCondition = false;
        let options = {};
        let conditions = {};
        if (query.hasOwnProperty('keyword')) {
            hasCondition = true;
            const keyword = query.keyword;
            conditions = {
                [Op.or]: [
                    {fullname: {[Op.like]: '%' + keyword + '%'}},
                    {email: {[Op.like]: '%' + keyword + '%'}},
                    {phone: {[Op.like]: '%' + keyword + '%'}},
                ]
            };
        }

        if (query.hasOwnProperty('status') && parseInt(query.status) > 0) {
            hasCondition = true;
            conditions.status = {[Op.eq]: parseInt(query.status)};
        }

        if (query.hasOwnProperty('gender') && parseInt(query.gender) > 0) {
            hasCondition = true;
            conditions.gender = {[Op.eq]: parseInt(query.gender)};
        }

        if (hasCondition) {
            options.where = conditions;
        }

        return options;
    };

    User.validate = function(formData) {
        let error = [];
        
        if (!formData.hasOwnProperty('fullname') || formData.fullname == '') {
            error.push('Bạn chưa nhập họ và tên.');
        }

        if (!formData.hasOwnProperty('email') || formData.email == '') {
            error.push('Bạn chưa nhập email.');
        } else if (!Helper.validateEmail(formData.email)) {
            error.push('Email không hợp lệ.');
        }

        if (!formData.hasOwnProperty('password') || formData.password == '') {
            error.push('Bạn chưa nhập mật khẩu.');
        } else if (formData.password.length < 6) {
            error.push('Mật khẩu phải có ít nhất 6 ký tự.');
        } else if (formData.hasOwnProperty('password2') || formData.password2 == '') {
            error.push('Bạn chưa nhập xác nhận mật khẩu.');
        } else if (formData.password != formData.password2 == '') {
            error.push('Xác nhận mật khẩu không hợp lệ.');
        }

        return error;
    };

    User.save = async function(formData) {
        let myObject = User.build(formData);

        [err, myInstance] = await Helper.to(myObject.save());
        if (err) {return false};
        return myInstance.id > 0;
    };

    return User;
}