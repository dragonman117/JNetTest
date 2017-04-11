/**
 * Created by Chris on 2/21/2017.
 */

module.exports = function(sequelize,DataTypes){
    var TestCase = sequelize.define('TestCase', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        input: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true
        },
        expected_output: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: false
        }
    });
    return TestCase;
};