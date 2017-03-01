/**
 * Created by Chris on 2/24/2017.
 */

module.exports = function(sequelize, DataTypes) {
    var Section = sequelize.define('Section', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false
        }
        }
    )
    return Section;
}
