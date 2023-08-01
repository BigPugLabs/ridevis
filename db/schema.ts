import { InferModel } from 'drizzle-orm'
import { int, mysqlTableCreator, text } from 'drizzle-orm/mysql-core'

const mysqlTable = mysqlTableCreator((name) => `rideviz_${name}`)

export const users = mysqlTable('users', {
    id: int('id').primaryKey(),
    name: text('name').notNull(),
})

export type User = InferModel<typeof users>
