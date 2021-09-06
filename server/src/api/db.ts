import {MongoClient, ListDatabasesResult} from 'mongodb';
import {Rogger} from '../utils/logger';

const logger = Rogger.getRogger(__filename);

// TODO add exception handeling and timeout for connection.

/**
 * Wrapper for connectiong and handeling a DB.
 */
 export class DB {
    private client: MongoClient; // the mongodb client.
    private db: string; // the current db name.

    constructor(address="localhost:27017") {
        const uri = `mongodb://${address}/?retryWrites=true&w=majority`;
        this.client = new MongoClient(uri);
    }

    /**
     * Connect to remote DB and verify the connection.
     */
    public async connect(): Promise<void> {
        let connected = false;
        while (!connected) {
            try {
                await this.client.connect();
                await this.client.db("admin").command({ ping: 1 });
                connected = true;
                logger.info("Connected successfully to server");
            } catch (e: any) {
                logger.warn("fail to connect to mongo retry.");
            }
        }

    }

    /**
     * Choose database form the remote DB.
     * @param {*} db
     */
    public setDB(db: string): void {
        this.db = db;
    }

    /**
     * get a all the recepies of with at least one ingredient from the list.
     * @param {string[]} ingredients - ingredients list.
     * @param {number} first - maximum number of entites returns.
     * @param {number} offset - skip number of entities.
     */
    public getRecepie(ingredients: string[], first?: number, offset?: number): Promise<Record<string, unknown>[]> {
        const reg_ingredients = ingredients.map(e => new RegExp(e, "i"));
        const result = this.client.db(this.db)
            .collection('recepies')
            .find({ingredients: {$elemMatch: { name: { $in: reg_ingredients }}}});
        offset && result.skip(offset);
        first && result.limit(first);
        return result.toArray();
    }

    /**
     * list all databases avaible on the remote DB.
     */
    public async listDatabases(): Promise<ListDatabasesResult>{
        const databasesList = await this.client.db().admin().listDatabases();
        return databasesList;
    }

    /**
     * list all collections avaible on the DB.
     */
    public async listCollections(): Promise<any[]>{
        const collectionsList = await this.client.db(this.db).listCollections().toArray();
        return collectionsList;
    }


    /**
     * close the connetion to the remote DB.
     */
    public close(): Promise<void> {
        return this.client.close();
    }
}