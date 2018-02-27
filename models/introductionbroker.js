module.exports = function(sequelize, app) {
    const Helper = require('../libs/helper');
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const config = app.get('config');
    const tableName = config.database.table_prefix + 'introduction_broker';
    const RegionModel = require(app.rootDir + '/models/region')(app.req.db, app);

    const IntroductionBroker = sequelize.define('introduction_broker', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        fullname: {
            type: Sequelize.STRING(255),
            defaultValue: '',
        },
        identitycard: {
            type: Sequelize.STRING(20),
            defaultValue: '',
        },
        birthday: {
            type: Sequelize.DATEONLY,
            defaultValue: new Date(0,0,0),
        },
        gender: {
            type: Sequelize.SMALLINT(1),
            defaultValue: 0,
        },
        phone: {
            type: Sequelize.STRING(50),
            defaultValue: '',
        },
        email: {
            type: Sequelize.STRING(50),
            defaultValue: '',
        },
        address: {
            type: Sequelize.STRING(255),
            defaultValue: '',
        },
        country: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        cityId: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            references: {
                model: RegionModel,
                key: 'id'
           }
        },
        districtId: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            references: {
                model: RegionModel,
                key: 'id'
           }
        },
        wardId: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            references: {
                model: RegionModel,
                key: 'id'
           }
        },
        product: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        note: {
            type: Sequelize.TEXT,
            defaultValue: 0,
        },
        isconnectallbroker: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
        },
        isreceivebonus: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
        },
        activationcode: {
            type: Sequelize.STRING(255),
            defaultValue: '',
        },
        status: {
            type: Sequelize.SMALLINT(3),
            defaultValue: 0,
        },
        datecreated: {
            type: Sequelize.DATE,
            defaultValue: new Date(),
        },
        datemodified: {
            type: Sequelize.DATE,
            defaultValue: new Date(),
        },
    }, {
        tableName: tableName,
        timestamps: true,
        createdAt: 'datecreated',
        updatedAt: 'datemodified',
        engine: 'MYISAM',
    });

    IntroductionBroker.belongsTo(RegionModel, {as: 'City'});
    IntroductionBroker.belongsTo(RegionModel, {as: 'District'});
    IntroductionBroker.belongsTo(RegionModel, {as: 'Ward'});

    IntroductionBroker.GENDER_MALE = 1;
    IntroductionBroker.GENDER_FEMALE = 3;

    IntroductionBroker.STATUS_ACTIVE = 1;
    IntroductionBroker.STATUS_UNACTIVE = 3;

    // Expansion Model
    IntroductionBroker.buildConditions = function(query) {
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
                    {identitycard: {[Op.like]: '%' + keyword + '%'}},
                ]
            };
        }

        if (query.hasOwnProperty('identitycard')) {
            hasCondition = true;
            conditions.identitycard = {[Op.eq]: query.identitycard};
        }

        if (query.hasOwnProperty('isreceivebonus')) {
            hasCondition = true;
            conditions.isreceivebonus = {[Op.eq]: query.isreceivebonus};
        }

        if (query.hasOwnProperty('isconnectallbroker')) {
            hasCondition = true;
            conditions.isconnectallbroker = {[Op.eq]: query.isconnectallbroker};
        }

        if (query.hasOwnProperty('gender') && parseInt(query.gender) > 0) {
            hasCondition = true;
            conditions.gender = {[Op.eq]: parseInt(query.gender)};
        }

        if (query.hasOwnProperty('cityId') && parseInt(query.cityId) > 0) {
            hasCondition = true;
            conditions.cityId = {[Op.eq]: parseInt(query.cityId)};
        }

        if (query.hasOwnProperty('districtId') && parseInt(query.districtId) > 0) {
            hasCondition = true;
            conditions.districtId = {[Op.eq]: parseInt(query.districtId)};
        }

        if (query.hasOwnProperty('wardId') && parseInt(query.wardId) > 0) {
            hasCondition = true;
            conditions.wardId = {[Op.eq]: parseInt(query.wardId)};
        }

        if (hasCondition) {
            options.where = conditions;
        }

        return options;
    };

    IntroductionBroker.validate = async function(formData) {
        let error = [];
        
        if (!formData.hasOwnProperty('fullname') || formData.fullname == '') {
            error.push('Bạn chưa nhập họ và tên.');
        }
        
        if (!formData.hasOwnProperty('phone') || formData.phone == '') {
            error.push('Bạn chưa nhập số điện thoại.');
        } else {
            [err, myObject] = await Helper.to(IntroductionBroker.findOne({where: {phone: formData.phone}}));
            if (myObject != null && myObject.id > 0) {
                error.push('Số điện thoại đã được đăng ký.');
            }
        }

        if (!formData.hasOwnProperty('email') || formData.email == '') {
            error.push('Bạn chưa nhập email.');
        } else if (!Helper.validateEmail(formData.email)) {
            error.push('Email không hợp lệ.');
        }

        return error;
    };

    IntroductionBroker.save = async function(formData) {
        formData.cityId = parseInt(formData.cityId) || 0;
        formData.districtId = parseInt(formData.districtId) || 0;
        formData.wardId = parseInt(formData.wardId) || 0;
        formData.product = parseInt(formData.product) || 0;
        formData.isconnectallbroker = parseInt(formData.isconnectallbroker) || 0;
        formData.isreceivebonus = parseInt(formData.isreceivebonus) || 0;

        let myObject = IntroductionBroker.build(formData);
        [err, myInstance] = await Helper.to(myObject.save());
        if (err) {return false};
        return myInstance.id > 0;
    };

    IntroductionBroker.getById = async function(id) {
        [err, myObject] = await Helper.to(IntroductionBroker.findOne({where: {id: id}}));
        if (myObject != null && myObject.id > 0) {
            return myObject;
        }

        return {id: 0}
    };

    IntroductionBroker.getByEmail = async function(email) {
        [err, myObject] = await Helper.to(IntroductionBroker.findOne({where: {email: email}}));
        if (myObject != null && myObject.id > 0) {
            return myObject;
        }

        return {id: 0}
    };

    return IntroductionBroker;
}