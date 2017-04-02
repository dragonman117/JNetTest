/**
 * Created by Chris on 2/21/2017.
 */

module.exports = function(sequelize, DataTypes) {
    var Question = sequelize.define('Question', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            allownull: false,
            primaryKey: true
        },
        prompt: {
            type: DataTypes.TEXT,
            allownull: true,
            unique: false
        },
        graphic: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        starter_code: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: false
        },
        average_score:{
            type: DataTypes.FLOAT,
            allowNull: true,
            unique: false
        },
        pts_test_case:{
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1.0,
            unique: false
        },
        pts_graded:{
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1.0,
            unique: false
        }
    })
    return Question;
}