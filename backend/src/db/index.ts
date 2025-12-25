import config from "../config/env";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(config.DB_URL!);

export default db;
