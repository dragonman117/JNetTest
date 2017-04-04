/**
 * Created by Chris on 4/3/2017.
 */

module.exports = function(sequelize, DataTypes) {
    var Submission = sequelize.define('Submission',{
        date_submitted: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false
        },
        date_graded:{
            type: DataTypes.DATE,
            unique: false,
            allowNull: true
        },
        grade: {
            type: DataTypes.FLOAT,
            unique: false,
            allowNull: true
        }
    });
    return Submission;
};