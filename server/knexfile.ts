import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },  
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    pool: {
        min: 2,
        max: 1000 // Aumente esse valor se necessário
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
}