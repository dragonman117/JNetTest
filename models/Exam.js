/**
 * Created by Chris on 2/21/2017.
 */

module.exports = function(sequelize, DataTypes) {
    var Exam = sequelize.define('Exam', {
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                unique: false,
                allowNull: false
            },
            published: {
                type: DataTypes.BOOLEAN,
                unique: false,
                allowNull: false
            },
            open_date: {
                type: DataTypes.DATE,
                unique: false,
                allowNull: true
            },
            close_date: {
                type: DataTypes.DATE,
                unique: false,
                allowNull: true
            },
            rules_stmt: {
                type: DataTypes.TEXT,
                unique: false,
                allowNull: true
            },
            //Time limits will be specified as minutes.
            time_limit: {
                type: DataTypes.INTEGER,
                unique: false,
                allowNull: true
            }
        }
    )
    return Exam
}