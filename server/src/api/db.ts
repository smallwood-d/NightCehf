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
    public getRecepie(reg_ingredients: string[], first?: number, offset?: number): Promise<Record<string, unknown>[]> {
        const aggregateQuery: Record<string, unknown>[] = 
        [ 
            {
                "$project": {
                    "name": 1,
                    "ingredients": 1,
                    "instructions": 1,
                    "isAllTrue": { 
                    "$allElementsTrue": {
                        $map: {
                                input: reg_ingredients, as: "ingredient",in: {
                                    $reduce: {
                                        input: "$ingredients",
                                        initialValue: 0,
                                        in: {
                                            $cond: [{ $regexMatch: { input: "$$this.name", regex: "$$ingredient" } },
                                                {$add: ["$$value",1]}, "$$value"] }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            { $match : { isAllTrue : true } },
            {   "$project": {
                    "name": 1,
                    "ingredients": 1,
                    "instructions": 1
                }
            }
        ];
            
        offset && aggregateQuery.push({ $skip: offset });
        first && aggregateQuery.push({ $limit: first });

        const result = this.client.db(this.db)
            .collection('recepies')
            .aggregate(aggregateQuery);
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