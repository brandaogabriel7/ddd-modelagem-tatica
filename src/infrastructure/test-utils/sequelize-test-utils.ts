import { Sequelize } from 'sequelize-typescript';
import { addSequelizeModels } from '../db/sequelize/model';

const createSequelizeTestInstance = (): Sequelize => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
    });

    addSequelizeModels(sequelize);

    return sequelize;
}

export { createSequelizeTestInstance };

