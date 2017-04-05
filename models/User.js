var bcrypt = require('bcrypt-nodejs')
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            first_name: {
                type: DataTypes.STRING,
                unique: false,
                allowNull: false
            },
            last_name:{
                type: DataTypes.STRING,
                unique: false,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            hooks: {
                beforeValidate: function(user, opt){
                    //username normalization
                    if(typeof user.email == "string"){
                        user.email = user.email.toLowerCase();
                    }
                },
                beforeCreate: function(user, opt){
                    //password stuffs...
                    var salt = bcrypt.genSaltSync(12);
                    user.password = bcrypt.hashSync(user.password,salt);
                },
                beforeUpdate: function(user, opt){
                    console.log(user);
                    if(user.dataValues.password.length < 60){
                        //password stuffs...
                        console.log("password change has been noted :)");
                        var salt = bcrypt.genSaltSync(12);
                        user.password = bcrypt.hashSync(user.password,salt);
                    }
                }
            },
            classMethods:{
                validPassword: function(pass1, pass2, done, user){
                    bcrypt.compare(pass1, pass2, function(err, isMatch){
                        if(isMatch){
                            console.log("WE did match");
                            return done(null, user);
                        }else{
                            console.log("WE did not match");
                            return done(null, false);
                        }
                    });
                }
            }
        }
    );

    return User
};