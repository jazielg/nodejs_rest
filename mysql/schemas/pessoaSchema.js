const Sequelize = require('sequelize')

const pessoaSchema = {
    name: 'dados',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        idade: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    options: {
        tableName: 'dados',
        freezeTableName: false, // plural table names
        timestamps: true,
        paranoid: false, // SoftDeletes
        underscored: false, // updated_at
        logging: false
    }
}

module.exports = pessoaSchema
