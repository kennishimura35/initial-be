const { Connection } = require("../helper/DBUtil");
const localStorage = require("localStorage");
const { Client, Pool } = require('pg');
const { BadRequest } = require("../helper/ResponseUtil");
const admin = require('firebase-admin');
const serviceAccount = require('../super-cron-firebase-adminsdk-nu48p-647079365f.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://super-cron-default-rtdb.asia-southeast1.firebasedatabase.app',
});
const firebase = admin.database();

class Pgsql {
  #connection = null;
  #usersRef = firebase.ref('cron');

  async getUsers(req, result) {
    try {
      const connection = new Pool({
          user: req.app.locals.PG_USER,
          host:  req.app.locals.PG_HOST,
          database: req.app.locals.PG_DATABASE,
          password: req.app.locals.PG_PASS,
          port: req.app.locals.PG_PORT
      });
     const query = `select * from pg_catalog.pg_user catalog order by usename asc`
     if (connection !== null && connection !== undefined){
      // console.log(this.#connection)
      connection.query(query,(err, res) => {
       connection.end()
       if (err) {
          connection.end()
         return result(err, null);
       }

        // this.#connection.end()
       return result(null, res.rows);
     })
    } else{
      return result("err", null);
    }
       
    } catch (error) {
        console.log(error)
    }
   };

   async getDatabases(req, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `select t1.datname AS db_name,  
    pg_size_pretty(pg_database_size(t1.datname)) as db_size,
    pg_database_size(t1.datname)
    from pg_database t1
    order by 3 desc
    `
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {
        connection.end()

        if (err) {
          connection.end()
          return result(err, null);
        }
  
        return result(null, res.rows);
      });
    } else{
      return result("err", null);
    }
     
    } catch (error) {
      console.log(error)
    }
   
  };

  async getDatabaseSize(req, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `select t1.datname AS db_name,  
    pg_size_pretty(pg_database_size(t1.datname)) as db_size,
    pg_database_size(t1.datname)
    from pg_database t1
    where t1.datname = '${req.app.locals.PG_DATABASE}'
    order by 3 desc`
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {
        connection.end()
        if (err) {
          connection.end()
          return result(err, null);
        }
        return result(null, res.rows);
      });
    } else{
      return result("err", null);
    }
     
    } catch (error) {
      console.log(error)
      
    }
   
  };

  async getTotalDatabaseSize(req, result) {
    try {
    const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
    });
    const query = `SELECT pg_size_pretty(sum(pg_database_size(datname))::bigint) AS total_database_size
    FROM pg_database;`
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res.rows);
      });
    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
   
  };

  async getSchemas(req, result) {
    try {
      const connection = new Pool({
        user: req.PG_USER,
        host:  req.PG_HOST,
        database: req.PG_DATABASE,
        password: req.PG_PASS,
        port: req.PG_PORT
    });
    const query = `SELECT schema_name FROM information_schema.schemata order by schema_name asc`
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res.rows);
      });
    } else{
      console.log("konz")
      return result("err", null);
    }
   
    } catch (error) {
      console.log(error)
    }
    
  };

  async getTables(req, schema, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `SELECT * FROM information_schema.tables WHERE table_schema = '${schema}' order by table_name asc `
    if (connection !== null && connection !== undefined){
      connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res.rows);
      });
    } else{
      return result("err", null);
    }
  } catch (error) {
    console.log(error)
  }
    
  };

  async getSuperuser(req, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `SELECT usename AS role_name,
                    CASE 
                        WHEN usesuper AND usecreatedb THEN 
                        CAST('superuser, create database' AS pg_catalog.text)
                        WHEN usesuper THEN 
                          CAST('superuser' AS pg_catalog.text)
                        WHEN usecreatedb THEN 
                          CAST('create database' AS pg_catalog.text)
                        ELSE 
                          CAST('' AS pg_catalog.text)
                      END role_attributes
                    FROM pg_catalog.pg_user where usesuper and usename = '${req.app.locals.PG_USER}'
                    ORDER BY role_name desc;
                    `
    if (connection !== null && connection !== undefined){
      connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }

        if(res.rows.length.toString() == '0'){
          return result('Not Superuser', null)
        }
        connection.end()
        return result(null, res.rows);
      });
    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
        console.log(error)
    }
    
  };
  async getPermissions(req, schema, result) {
    try {
    // const query = `SELECT * FROM information_schema.table_privileges 
    // where table_schema like '%${schema.table_schema}%' 
    // and grantee like '%${schema.grantee}%' and table_name like '%${schema.table_name}%'`

    const connection = new Pool({
      user: req.app.locals.PG_USER,
      host:  req.app.locals.PG_HOST,
      database: req.app.locals.PG_DATABASE,
      password: req.app.locals.PG_PASS,
      port: req.app.locals.PG_PORT
    });
    const query = `SELECT 
    n.nspname AS schema_name,
    c.relname AS object_name,
    CASE 
        WHEN c.relkind = 'r' THEN 'table'
        WHEN c.relkind = 'v' THEN 'view'
        WHEN c.relkind = 'S' THEN 'sequence'
        WHEN c.relkind = 'm' THEN 'materialized view'
        ELSE 'other'
    END AS object_type,
    grantee AS user,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) AS permissions
    FROM 
        pg_class c
    JOIN 
        pg_namespace n ON n.oid = c.relnamespace
    JOIN 
        (
            SELECT 
                table_name,
                grantee,
                privilege_type
            FROM 
                information_schema.table_privileges
            WHERE 
                grantee like '%${schema.grantee}%'
                and table_name like '%${schema.table_name}%'
        ) p ON p.table_name = c.relname 
    where n.nspname = '${schema.table_schema}'
    GROUP BY 
        n.nspname, c.relname, object_type, grantee
    ORDER BY 
        n.nspname, c.relname, grantee;`

    const query2 = `SELECT 
        n.nspname AS schema_name,
        c.relname AS object_name,
        CASE 
            WHEN c.relkind = 'r' THEN 'table'
            WHEN c.relkind = 'v' THEN 'view'
            WHEN c.relkind = 'S' THEN 'sequence'
            WHEN c.relkind = 'm' THEN 'materialized view'
            ELSE 'other'
        END AS object_type,
        grantee AS user,
        string_agg(privilege_type, ', ' ORDER BY privilege_type) AS permissions
        FROM 
            pg_class c
        JOIN 
            pg_namespace n ON n.oid = c.relnamespace
        JOIN 
            (
                SELECT 
                    table_name,
                    grantee,
                    privilege_type
                FROM 
                    information_schema.table_privileges
                WHERE 
                    grantee = '${schema.grantee}'
                    and table_name like '%${schema.table_name}%'
            ) p ON p.table_name = c.relname 
        where n.nspname = '${schema.table_schema}'
        GROUP BY 
            n.nspname, c.relname, object_type, grantee
        ORDER BY 
            n.nspname, c.relname, grantee;`

        const query3 = `SELECT 
            n.nspname AS schema_name,
            c.relname AS object_name,
            CASE 
                WHEN c.relkind = 'r' THEN 'table'
                WHEN c.relkind = 'v' THEN 'view'
                WHEN c.relkind = 'S' THEN 'sequence'
                WHEN c.relkind = 'm' THEN 'materialized view'
                ELSE 'other'
            END AS object_type,
            grantee AS user,
            string_agg(privilege_type, ', ' ORDER BY privilege_type) AS permissions
            FROM 
                pg_class c
            JOIN 
                pg_namespace n ON n.oid = c.relnamespace
            JOIN 
                (
                    SELECT 
                        table_name,
                        grantee,
                        privilege_type
                    FROM 
                        information_schema.table_privileges
                    WHERE 
                        grantee = '${schema.grantee}'
                        and table_name = '${schema.table_name}'
                ) p ON p.table_name = c.relname 
            where n.nspname = '${schema.table_schema}'
            GROUP BY 
                n.nspname, c.relname, object_type, grantee
            ORDER BY 
                n.nspname, c.relname, grantee;`
      
      
      const query4 = `SELECT 
                n.nspname AS schema_name,
                c.relname AS object_name,
                CASE 
                    WHEN c.relkind = 'r' THEN 'table'
                    WHEN c.relkind = 'v' THEN 'view'
                    WHEN c.relkind = 'S' THEN 'sequence'
                    WHEN c.relkind = 'm' THEN 'materialized view'
                    ELSE 'other'
                END AS object_type,
                grantee AS user,
                string_agg(privilege_type, ', ' ORDER BY privilege_type) AS permissions
                FROM 
                    pg_class c
                JOIN 
                    pg_namespace n ON n.oid = c.relnamespace
                JOIN 
                    (
                        SELECT 
                            table_name,
                            grantee,
                            privilege_type
                        FROM 
                            information_schema.table_privileges
                        WHERE 
                            grantee like '%${schema.grantee}%'
                            and table_name like '%${schema.table_name}%'
                    ) p ON p.table_name = c.relname 
                where n.nspname like '%${schema.table_schema}%'
                GROUP BY 
                    n.nspname, c.relname, object_type, grantee
                ORDER BY 
                    n.nspname, c.relname, grantee;`

       const query5 = `SELECT 
                n.nspname AS schema_name,
                c.relname AS object_name,
                CASE 
                    WHEN c.relkind = 'r' THEN 'table'
                    WHEN c.relkind = 'v' THEN 'view'
                    WHEN c.relkind = 'S' THEN 'sequence'
                    WHEN c.relkind = 'm' THEN 'materialized view'
                    ELSE 'other'
                END AS object_type,
                grantee AS user,
                string_agg(privilege_type, ', ' ORDER BY privilege_type) AS permissions
                FROM 
                    pg_class c
                JOIN 
                    pg_namespace n ON n.oid = c.relnamespace
                JOIN 
                    (
                        SELECT 
                            table_name,
                            grantee,
                            privilege_type
                        FROM 
                            information_schema.table_privileges
                        WHERE 
                            grantee like '%${schema.grantee}%'
                            and table_name = '${schema.table_name}'
                    ) p ON p.table_name = c.relname 
                where n.nspname = '${schema.table_schema}'
                GROUP BY 
                    n.nspname, c.relname, object_type, grantee
                ORDER BY 
                    n.nspname, c.relname, grantee;`

              const query6 = `SELECT 
                n.nspname AS schema_name,
                c.relname AS object_name,
                CASE 
                    WHEN c.relkind = 'r' THEN 'table'
                    WHEN c.relkind = 'v' THEN 'view'
                    WHEN c.relkind = 'S' THEN 'sequence'
                    WHEN c.relkind = 'm' THEN 'materialized view'
                    ELSE 'other'
                END AS object_type,
                grantee AS user,
                string_agg(privilege_type, ', ' ORDER BY privilege_type) AS permissions
                FROM 
                    pg_class c
                JOIN 
                    pg_namespace n ON n.oid = c.relnamespace
                JOIN 
                    (
                        SELECT 
                            table_name,
                            grantee,
                            privilege_type
                        FROM 
                            information_schema.table_privileges
                        WHERE 
                            grantee = '${schema.grantee}'
                            and table_name like '%${schema.table_name}%'
                    ) p ON p.table_name = c.relname 
                where n.nspname like '%${schema.table_schema}%'
                GROUP BY 
                    n.nspname, c.relname, object_type, grantee
                ORDER BY 
                    n.nspname, c.relname, grantee;`

    if (connection !== null && connection !== undefined){
      if(schema.table_schema !== '' && schema.grantee == '' && schema.table_name == ''){
        connection.query(query, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      } else if(schema.table_schema !== '' && schema.grantee !== '' && schema.table_name == ''){
        connection.query(query2, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      } else if(schema.table_schema !== '' && schema.grantee !== '' && schema.table_name !== ''){
        connection.query(query3, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      } else if(schema.table_schema !== '' && schema.grantee === '' && schema.table_name !== ''){
        connection.query(query5, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      } else if(schema.table_schema === '' && schema.grantee !== '' && schema.table_name === ''){
        connection.query(query6, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      }else {
        connection.query(query4, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      }
    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async getTableSize(req, schema, table_name, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });

    const query = `select table_schema, table_name, pg_relation_size('"'||table_schema||'"."'||table_name||'"'),
    pg_size_pretty(pg_relation_size('"'||table_schema||'"."'||table_name||'"'))
    from information_schema.tables where table_schema = '${schema}' and table_name like '%${table_name}%' 
    order by 3 desc`

    const query2 = `select table_schema, table_name, pg_relation_size('"'||table_schema||'"."'||table_name||'"'),
    pg_size_pretty(pg_relation_size('"'||table_schema||'"."'||table_name||'"'))
    from information_schema.tables where table_schema like '%${schema}%' and table_name like '%${table_name}%' 
    order by 3 desc`

    if (connection !== null && connection !== undefined){

      if(schema === ''){
        connection.query(query2, (err, res) => {

          if (err) {
            connection.end()
            return result(err, null);
          }
          connection.end()
          return result(null, res.rows);
        });
      }
      
      else{
        connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res.rows);
      });
      }
    } else{
      return result("err", null);
    }
  } catch (error) {
    console.log(error)
  }
  };

  async loginDatabase(req, result) {
    try {
    let errs = null
    this.#connection = new Client({
      user: req.app.locals.PG_USER,
      host:  req.app.locals.PG_HOST,
      database: req.app.locals.PG_DATABASE,
      password: req.app.locals.PG_PASS,
      port: req.app.locals.PG_PORT
    });
    this.#connection.connect((err, res) => {

      if (err) {
        this.#connection.end()
        return result(err, null);
      }
      // this.#connection.end()
      return result(null, [1]);
      
    })
    
      
    } catch (error) {
        console.log(error)
    }
  
  };

  async grantAllToAllSchemas(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = ``
    schemas?.map((item) => {
      if(item.schema_name !== 'pg_toast' && item.schema_name !== 'pg_temp_1' && 
      item.schema_name !== 'pg_toast_temp_1' && item.schema_name !== 'pg_catalog' && 
      item.schema_name !== 'information_schema'){
        // console.log(item.schema_name)
        query += `
        GRANT USAGE on schema ${item.schema_name} to  ${user}; 
        GRANT ALL
        ON SCHEMA ${item.schema_name} 
        TO ${user}; 
        `
      }
      
    })

    // console.log(query)
  
    if (connection !== null && connection !== undefined){

      
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantSelectAllToAllSchemas(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = ``
    schemas?.map((item) => {
      if(item.schema_name !== 'pg_toast' && item.schema_name !== 'pg_temp_1' && 
      item.schema_name !== 'pg_toast_temp_1' && item.schema_name !== 'pg_catalog' && 
      item.schema_name !== 'information_schema'){
        // console.log(item.schema_name)
        query += `
        GRANT USAGE on schema ${item.schema_name} to  ${user}; 
        `
      }
      
    })

    // console.log(query)
  
    if (connection !== null && connection !== undefined){

      
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantAllTablesToAllSchemas(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
    `
    schemas?.map((item) => {
      if(item.schema_name !== 'pg_toast' && item.schema_name !== 'pg_temp_1' && 
      item.schema_name !== 'pg_toast_temp_1' && item.schema_name !== 'pg_catalog' && 
      item.schema_name !== 'information_schema'){
        // console.log(item.schema_name)
        query += `
        GRANT USAGE on schema ${item.schema_name} to ${user}; 
        GRANT ALL
        ON ALL TABLES IN SCHEMA ${item.schema_name} 
        TO ${user}; 
        GRANT ALL ON ALL SEQUENCES IN SCHEMA ${item.schema_name} TO ${user};
        GRANT ALL ON ALL FUNCTIONS IN SCHEMA ${item.schema_name} TO ${user};
        GRANT CREATE, CONNECT ON database ${req.app.locals.PG_DATABASE} TO ${user};
        `
      }
      
    })

    // console.log(query)
  
    if (connection !== null && connection !== undefined){

      
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantSelectAllTablesToAllSchemas(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
    `
    schemas?.map((item) => {
      if(item.schema_name !== 'pg_toast' && item.schema_name !== 'pg_temp_1' && 
      item.schema_name !== 'pg_toast_temp_1' && item.schema_name !== 'pg_catalog' && 
      item.schema_name !== 'information_schema'){
        // console.log(item.schema_name)
        query += `
        GRANT USAGE on schema ${item.schema_name} to ${user}; 
        GRANT SELECT
        ON ALL TABLES IN SCHEMA ${item.schema_name} 
        TO ${user}; 
        GRANT SELECT ON ALL SEQUENCES IN SCHEMA ${item.schema_name} TO ${user};
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ${item.schema_name} TO ${user};
        `
      }
      
    })

    // console.log(query)
  
    if (connection !== null && connection !== undefined){

      
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantAllToSchema(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
        GRANT USAGE on schema ${schemas} to ${user}; 
        GRANT ALL
        ON SCHEMA ${schemas} 
        TO ${user}; 
        `
    // console.log(query)
  
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantSelectAllToSchema(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
        GRANT USAGE on schema ${schemas} to ${user}; 
        `
    // console.log(query)
  
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantAllTablesToSchema(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
        GRANT USAGE on schema ${schemas} to  ${user}; 
        GRANT ALL ON ALL TABLES
        IN SCHEMA ${schemas} 
        TO ${user}; 
        GRANT ALL ON ALL SEQUENCES IN SCHEMA ${schemas} TO ${user};
        GRANT ALL ON ALL FUNCTIONS IN SCHEMA ${schemas} TO ${user};
        `
    // console.log(query)
  
    if (connection !== null && connection!== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantSelectAllTablesToSchema(req, schemas, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
        GRANT USAGE on schema ${schemas} to  ${user}; 
        GRANT SELECT ON ALL TABLES
        IN SCHEMA ${schemas} 
        TO ${user}; 
        GRANT SELECT ON ALL SEQUENCES IN SCHEMA ${schemas} TO ${user};
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ${schemas} TO ${user};
        `
    // console.log(query)
  
    if (connection !== null && connection !== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async grantAllToDatabase(req, databases, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    let query = `
        GRANT ALL
        ON database ${databases} 
        TO ${user}; 
        `
    // console.log(query)
  
    if (connection!== null && connection !== undefined){
      connection.query(query,(err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async createSchema(req, schemas, user, result) {
    const connection = new Pool({
      user: req.app.locals.PG_USER,
      host:  req.app.locals.PG_HOST,
      database: req.app.locals.PG_DATABASE,
      password: req.app.locals.PG_PASS,
      port: req.app.locals.PG_PORT
    });
    try {
    const query = `CREATE SCHEMA ${schemas} AUTHORIZATION ${user}`
    // console.log(query)
  
    if (connection !== null && connection !== undefined){
      connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async createDatabase(req, databases, user, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `CREATE DATABASE ${databases} WITH OWNER ${user}`
    // console.log(query)
  
    if (connection !== null && connection !== undefined){
      connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async createUser(req, user, password, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `create user ${user} with encrypted password '${password}';`;
    if (connection !== null && connection !== undefined){
      connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };

  async allSQL(req, sql, result) {
    try {
      const connection = new Pool({
        user: req.app.locals.PG_USER,
        host:  req.app.locals.PG_HOST,
        database: req.app.locals.PG_DATABASE,
        password: req.app.locals.PG_PASS,
        port: req.app.locals.PG_PORT
      });
    const query = `${sql}`;
    if (connection !== null && connection !== undefined){
      console.log(query)
      connection.query(query, (err, res) => {

        if (err) {
          connection.end()
          return result(err, null);
        }
        connection.end()
        return result(null, res);
      });

    } else{
      return result("err", null);
    }
    
      
    } catch (error) {
      console.log(error)
    }
  };


  async createCron(datacron, result) {
    console.log("datacron: ", datacron)
    try {
      this.#usersRef.push(datacron, (err, res) => {
        
    if (err) {
      console.error('Error menambahkan data:', err);
      // admin.app().delete();

      return result(err, null);
      

    } else {
      console.log('Data berhasil ditambahkan.');
      // admin.app().delete();

      return result(null, res);
    }
    // Jangan lupa untuk menutup koneksi setelah selesai (opsional)
  });
      
    } catch (error) {
      console.log(error)
    }
  };

  async getCron(req, result) {
    try {
      
      this.#usersRef.once('value')
      .then((snapshot) => {
        const allData = snapshot.val();
        console.log('Semua data:', allData);
        // Jangan lupa untuk menutup koneksi setelah selesai (opsional)
        // admin.app().delete();
        return result(null, allData)
      })
      .catch((error) => {
        console.error('Error mendapatkan data:', error);
        // Jangan lupa untuk menutup koneksi setelah selesai (opsional)
        // admin.app().delete();
        return result(error, null)
      });
     
    } catch (error) {
      console.log(error)
    }
   
  };
}



module.exports = { Pgsql };
