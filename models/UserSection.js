/**
 * Created by Chris on 2/27/2017.
 */

module.exports = function(sequelize, DataTypes){
    var UserSection = sequelize.define('UserSection', {
            role: {
                //type: DataTypes.ENUM('STUDENT', 'INSTRUCTOR', 'TA', 'PROCTOR'),
                type: DataTypes.STRING,
                unique: false,
                allowNull: false
            }
        }
    );
    return UserSection;
}