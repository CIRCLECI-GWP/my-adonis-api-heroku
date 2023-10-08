/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env";
import Application from "@ioc:Adonis/Core/Application";
import type { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";
import URL from "url-parse";
const PROD_MYSQL_DB = new URL(Env.get("JAWSDB_URL"));

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get("DB_CONNECTION"),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | SQLite
    |--------------------------------------------------------------------------
    |
    | Configuration for the SQLite database.  Make sure to install the driver
    | from npm when using this connection
    |
    | npm i sqlite3
    |
    */
    sqlite: {
      client: "sqlite",
      connection: {
        filename: Application.tmpPath("db.sqlite3"),
      },
      pool: {
        afterCreate: (conn, cb) => {
          conn.run("PRAGMA foreign_keys=true", cb);
        },
      },
      migrations: {
        naturalSort: true,
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    },
    mysql: {
      client: "mysql",
      connection: {
        host: Env.get("DB_HOST", PROD_MYSQL_DB.host),
        port: Env.get("DB_PORT", ""),
        user: Env.get("DB_USER", PROD_MYSQL_DB.username),
        password: Env.get("DB_PASSWORD", PROD_MYSQL_DB.password),
        database: Env.get("DB_DATABASE", PROD_MYSQL_DB.pathname.substr(1)),
      },
      healthCheck: false,
      debug: Env.get("DB_DEBUG", false),
    },
  },
};

export default databaseConfig;
