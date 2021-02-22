import knex from 'knex';
import path from 'path';

const conection = knex({
    client : 'sqlite3',
    connection: {
        //Onde o BD está
        filename : path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true,
});
export default conection;