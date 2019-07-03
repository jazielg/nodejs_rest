const Sequelize = require('sequelize')

const pessoaSchema = {
    name: 'usuarios',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    options: {
        tableName: 'usuarios',
        freezeTableName: false, // plural table names
        timestamps: true,
        paranoid: false, // SoftDeletes
        underscored: false, // updated_at
        logging: false
    }
}

module.exports = pessoaSchema
