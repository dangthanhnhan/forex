module.exports = function(sequelize, app) {
    const Helper = require('../libs/helper');
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const config = app.get('config');
    const tableName = config.database.table_prefix + 'region';

    const Region = sequelize.define('region', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(50),
            defaultValue: '',
        },
        slug: {
            type: Sequelize.STRING(255),
            defaultValue: '',
        },
        country: {
            type: Sequelize.STRING(2),
            defaultValue: '',
        },
        displayorder: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        parentid: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        level: {
            type: Sequelize.SMALLINT(1),
            defaultValue: 0,
        },
    }, {
        tableName: tableName,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        engine: 'MYISAM',
    });

    Region.GENDER_MALE = 1;
    Region.GENDER_FEMALE = 3;

    // Expansion Model
    Region.buildConditions = function(query) {
        let hasCondition = false;
        let options = {};
        let conditions = {};
        if (query.hasOwnProperty('keyword')) {
            hasCondition = true;
            const keyword = query.keyword;
            conditions = {
                [Op.or]: [
                    {name: {[Op.like]: '%' + keyword + '%'}},
                ]
            };
        }

        if (query.hasOwnProperty('parentid')) {
            hasCondition = true;
            conditions.parentid = {[Op.eq]: query.parentid};
        }

        if (query.hasOwnProperty('level')) {
            hasCondition = true;
            conditions.level = {[Op.eq]: query.level};
        }

        if (hasCondition) {
            options.where = conditions;
        }

        return options;
    };

    Region.validate = async function(formData) {
        let error = [];
        
        if (!formData.hasOwnProperty('fullname') || formData.fullname == '') {
            error.push('Bạn chưa nhập họ và tên.');
        }
        
        if (!formData.hasOwnProperty('phone') || formData.phone == '') {
            error.push('Bạn chưa nhập số điện thoại.');
        } else {
            [err, myObject] = await Helper.to(Region.findOne({where: {phone: formData.phone}}));
            if (myObject != null && myObject.id > 0) {
                error.push('Số điện thoại đã được đăng ký.');
            }
        }

        if (formData.hasOwnProperty('email') && formData.email != '') {
            if (!Helper.validateEmail(formData.email)) {
                error.push('Email không hợp lệ.');    
            }
        }

        return error;
    };

    Region.save = async function(formData) {
        let myObject = Region.build(formData);
        [err, myInstance] = await Helper.to(myObject.save());
        if (err) {return false};
        return myInstance.id > 0;
    };

    Region.getCountries = function() {
        return [
            {
                id: 1,
                name: 'Việt Nam',
                code: 'vn',
            },
            {
                id: 2,
                name: 'England',
                code: 'en',
            },
            {
                id: 3,
                name: 'United States',
                code: 'us',
            },
            {
                id: 4,
                name: 'Canada',
                code: 'ca',
            },
            {
                id: 5,
                name: 'Japan',
                code: 'ja',
            },
            {
                id: 6,
                name: 'Korea',
                code: 'ko',
            }
        ];
    };

    return Region;
}