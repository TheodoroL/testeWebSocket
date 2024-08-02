import { ChatDatabase } from "../modelos/Database.js";
import { initDatabase } from "./util/database.js";

export const database = await initDatabase<ChatDatabase>('database.json', {
    users: []
});