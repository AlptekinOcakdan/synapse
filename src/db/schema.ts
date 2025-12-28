import {pgTable, uuid, varchar} from "drizzle-orm/pg-core";
import {createSelectSchema} from "drizzle-zod";

export const users = pgTable("users", {
    userId: uuid("id").primaryKey().defaultRandom(),
    firstname: varchar({ length: 255 }).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});
export const userSelectSchema = createSelectSchema(users);
