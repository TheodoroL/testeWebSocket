import { writeFile, readFile, access, constants } from "fs/promises";

type Comparison<T> = Partial<T> & {
    '*'?: boolean
};

export async function initDatabase<T extends { [key: string]: any[] }>(path: string, defaultValue: T = {} as T) {
    let database: T;

    try {
        await access(path, constants.F_OK);
        const data = await readFile(path, 'utf8');
        database = JSON.parse(data) as T;
    } catch (error) {
        database = defaultValue as T;
        await writeFile(path, JSON.stringify(database), 'utf-8');
    }

    return Object.freeze({
        async insert<Table extends keyof T>(table: Table, value: T[Table][number]) {
            database[table].push(value);
            await this.save();
        },

        select<Table extends keyof T>(table: Table, comparison: Comparison<T[Table][number]>, all: boolean = false): T[Table][number] {
            const tbl = database[table];

            const cmp = (data: T[Table][number]) => {
                if (comparison['*']) {
                    return true;
                }

                let result = true;
                for (const key of Object.keys(comparison)) {
                    result = comparison[key] === data[key];
                }
                return result;
            };

            return all
                ? tbl.filter(cmp)
                : tbl.find(cmp)
        },

        totalRows<Table extends keyof T>(table: Table) {
            return database[table].length;
        },

        async save() {
            await writeFile(path, JSON.stringify(database), 'utf-8');
        }
    });
}