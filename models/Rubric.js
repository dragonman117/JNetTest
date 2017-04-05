/**
 * Created by Chris on 2/28/2017.
 */

module.exports = function(sequelize, DataTypes) {
    var Rubric = sequelize.define('Rubric', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        data: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
            primaryKey: false
        }
    })
    return Rubric;
}