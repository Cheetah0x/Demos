"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    fid: (0, pg_core_1.text)("fid").notNull().unique(),
    username: (0, pg_core_1.text)("username").notNull(),
    ethaddress: (0, pg_core_1.text)("ethaddress"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
}, function (users) {
    return {
        uniqueIdx: (0, pg_core_1.uniqueIndex)("fid_unique_idx").on(users.fid),
    };
});
