/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createSchema('url_shortner');
    pgm.createTable({
        schema: 'url_shortner',
        name: 'urls',
    }, {
        id: { type: 'serial', primaryKey: true },
        original_url: { type: 'text', notNull: false },
        short_url: { type: 'varchar(10)', notNull: false },
        created_at: {
            type: 'timestamp',
            notNull: false,
            default: pgm.func('current_timestamp'),
        },
        expire_at: {
            type: 'timestamp',
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
