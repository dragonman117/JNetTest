/**
 * Created by Chris on 4/3/2017.
 */

module.exports = function(sequelize, DataTypes){
    var Response = sequelize.define('Response', {
        data: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true
        },
        score_test_case: {
            type: DataTypes.FLOAT,
            unique: false,
            allownull: true
        },
        score_graded: {
            type: DataTypes.FLOAT,
            unique: false,
            allowNull: true
        }
    });
    return Response;
};