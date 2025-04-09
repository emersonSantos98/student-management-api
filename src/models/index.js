import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import config from '../config/config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig
    );
}

const importModel = async (file) => {
    const module = await import(path.join(__dirname, file));
    return module.default(sequelize, Sequelize.DataTypes);
};

const loadModels = async () => {
    const files = fs.readdirSync(__dirname)
        .filter(file =>
            file !== basename &&
            file.slice(-3) === '.js' &&
            !file.includes('.test.js')
        );

    for (const file of files) {
        const model = await importModel(file);
        db[model.name] = model;
    }

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
};

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
