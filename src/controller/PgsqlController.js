const { Pgsql } = require("../model/Pgsql");
const moment = require('moment');
const uuid = require("uuid").v4;
const localStorage = require("localStorage");
const { Client, Pool } = require('pg');
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
const { createJwtToken } = require("../helper/JwtUtil");
require('dotenv').config();


class PgsqlController {
  #pgsql;

  constructor() {
    this.#pgsql = new Pgsql();
  }


  convertInputFilter(req) {
    let pgsql_name = !req.query.pgsql_name ? "" : req.query.pgsql_name.toLowerCase();
    
    
    return { pgsql_name };
  }

  isNumber(val) {
    return !isNaN(val);
  }

  validateInputPagination(req) {
    const messages = [];

    let page = !req.query.page ? 1 : req.query.page;
    let perPage = !req.query.perPage ? 10 : req.query.perPage;
    let orderBy = !req.query.orderBy ? "pgsql_name" : req.query.orderBy.toString();
    let orderValue = !req.query.orderValue
      ? "ASC"
      : req.query.orderValue.toString().toUpperCase();
     
      

    if (!this.isNumber(page)) {
      messages.push(
        "Nilai field 'page' tidak sesuai ketentuan, contoh: 1, 2, ..."
      );
    }
    
    if (page <= 0) {
      messages.push("Nilai field 'page' harus lebih besar dari nol");
    }
    


    if (!this.isNumber(perPage)) {
      messages.push(
        "Nilai field 'perPage' tidak sesuai ketentuan, contoh: 5, 10, ..."
      );
    } else if (perPage <= 0) {
      messages.push("Nilai field 'perPage' harus lebih besar dari nol");
    }

    
    if (
      !["created_at", "pgsql_name"].includes(orderBy)
    ) {
      messages.push(
        "Nilai field 'orderBy' harus diantara created_at, pgsql_name"
      );
    } else {
      orderBy = orderBy === "created_at" ? "created_at" : orderBy;
      orderBy = orderBy === "pgsql_name" ? "pgsql_name" : orderBy;
    }

    if (!["ASC", "DESC"].includes(orderValue)) {
      messages.push(
        "Nilai field 'orderValue' harus diantara 'ASC' atau 'DESC'"
      );
    }

    return {
      messages,
      page: parseInt(page),
      perPage: parseInt(perPage),
      orderBy,
      orderValue,
    };
  }

  getUsers = (req, res) => {
    const messages = [];

    try {
    this.#pgsql.getUsers(req, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Users berhasil ditemukan`);
      const users  = [];

      data.forEach(user => {
        users.push({
          user : user.usename
        });
      });

      return Ok(
        res,
        messages,
        users
      );
 
    });
       
    } catch (error) {
      console.log(error)
    }
  }

  getDatabases = (req, res) => {
    const messages = [];

    try {
    this.#pgsql.getDatabases(req, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Databases berhasil ditemukan`);
      const databases  = [];

      data.forEach(database => {
        databases.push({
          datname : database.db_name,
          db_size: database.db_size
        });
      });

      return Ok(
        res,
        messages,
        databases
      );
 
    });
       
    } catch (error) {
        console.log(error)
    }
  }

  getDatabaseSize = (req, res) => {
    const messages = [];

    try {
    this.#pgsql.getDatabaseSize(req, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Databases berhasil ditemukan`);
      const databases  = [];
      data.forEach(database => {
        databases.push({
          database_name : database.db_name,
          pg_size_pretty : database.db_size,
        });
      });

      return Ok(
        res,
        messages,
        databases
      );
 
    });
        
    } catch (error) {
        console.log(error)
    }
  }

  getTotalDatabaseSize = (req, res) => {
    const messages = [];

    try {
    this.#pgsql.getTotalDatabaseSize(req, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Databases berhasil ditemukan`);
      const databases  = [];
      data.forEach(database => {
        databases.push({
          total_database_size : database.total_database_size,
        });
      });

      return Ok(
        res,
        messages,
        databases
      );
 
    });
    } catch (error) {
        console.log(error)
    }
  }

  getSchemas = (req, res) => {
    const messages = [];
    try {
    this.#pgsql.getSchemas(req.app.locals, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Schemas berhasil ditemukan`);
      const schemas  = [];

      data.forEach(schema => {
        schemas.push({
          schema_name : schema.schema_name
        });
      });

      return Ok(
        res,
        messages,
        schemas
      );
 
    });
       
    } catch (error) {
        console.log(error)
    }
  }

  getTables = (req, res) => {
    const messages = [];
    const schema = req.query.schema

    try {
    this.#pgsql.getTables(req, schema, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`tables berhasil ditemukan`);
      const schemas  = [];

      data.forEach(schema => {
        schemas.push({
          table_name : schema.table_name
        });
      });

      return Ok(
        res,
        messages,
        schemas
      );
 
    });
         
    } catch (error) {
        console.log(error)
    }
  }

  getSuperUser = (req, res) => {
    const messages = [];

    try {
    this.#pgsql.getSuperuser(req, (err, data) => {
      if (err) {
        if(err.includes('Not Superuser')){
          messages.push('Not Superuser')
          return Unauthorized(res, messages)
        } else {
          messages.push('Internal error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }
        
      }

      messages.push(`User berhasil ditemukan`);
      const users  = [];

      users.forEach(us => {
        users.push({
          role_name : us.role_name,
          role_attributes: us.role_attributes
        });
      });

      return Ok(
        res,
        messages,
        users
      );
 
    });
         
    } catch (error) {
        console.log(error)
    }
  }

  getPermissions = (req, res) => {
    const messages = [];
    const schemata = {
      grantee: req.query.grantee,
      table_schema: req.query.table_schema,
      table_name: req.query.table_name
    }

    try {
    this.#pgsql.getPermissions(req, schemata, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`permissions berhasil ditemukan`);
      const schemas  = [];

      data.forEach(schema => {
        schemas.push({
          schema_name: schema.schema_name,
          user: schema.user,
          table: schema.object_name,
          permissions: schema.permissions,
          object_type : schema.object_type,
          // privilege_type: schema.privilege_type
        });
      });

      return Ok(
        res,
        messages,
        schemas
      );
 
    });
  } catch (error) {
      console.log(error)
  }
  }

  getTableSize = (req, res) => {
    const messages = [];
    const schemata = req.query.schema
    const table_name = req.query.table_name

    try {
    this.#pgsql.getTableSize(req, schemata, table_name,(err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Table berhasil ditemukan`);
      const schemas  = [];

      data.forEach(schema => {
        schemas.push({
          table_schema : schema.table_schema,
          table_name: schema.table_name,
          pg_relation_size: schema.pg_relation_size,
          pg_size_pretty: schema.pg_size_pretty
        });
      });

      return Ok(
        res,
        messages,
        schemas
      );
 
    });
       
  } catch (error) {
      console.log(error)
  }
  }

  loginDatabase = (req, res) => {
    try {
    const messages = [];

    // req.app.locals.PG_DATABASE= req?.body?.PG_DATABASE
    // req.app.locals.PG_HOST= req?.body?.PG_HOST
    // req.app.locals.PG_PORT= req?.body?.PG_PORT
    // req.app.locals.PG_USER= req?.body?.PG_USER
    // req.app.locals.PG_PASS= req?.body?.PG_PASS

    const dataToken = {
      user: req.body.PG_USER,
      host:  req.body.PG_HOST,
      database: req.body.PG_DATABASE,
      password: req.body.PG_PASS,
      port: req.body.PG_PORT
    }

    const connection = new Pool({
      user: req.body.PG_USER,
      host:  req.body.PG_HOST,
      database: req.body.PG_DATABASE,
      password: req.body.PG_PASS,
      port: req.body.PG_PORT
    });

    connection.connect((err, data) => {
      connection.end()
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Berhasil melakukan Login!`);
      const datas  = {};

      // data.forEach(schema => {
      //   schemas.push({
      //     schema_name : schema.schema_name
      //   });
      // });
      datas.token = createJwtToken(dataToken)

      return Ok(
        res,
        messages,
        datas
      );
 
    });
    } catch (error) {
        console.log(error)
    }
  }

  grantAllToAllSchemas = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;

    if (schemas === null || user === null){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.grantAllToAllSchemas(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

        // data.forEach(dt => {
        //   datas.push({
        //     command : dt.command
        //   });
        // });

        return DataCreated(
          res,
          messages,
        );
  
      });
        
      } catch (error) {
        console.log(error)
      }
    }

    grantSelectAllToAllSchemas = (req, res) => {
      const messages = [];
      const schemas = req.body.schemas;
      const user = req.body.user;
  
      if (schemas === null || user === null){
        return BadRequest(res, "Data not valid");
      }
  
      try {
      this.#pgsql.grantSelectAllToAllSchemas(req, schemas, user, (err, data) => {
        if (err) {
          messages.push('Internal error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }
        console.log(data.command)
  
        messages.push(`Granted user ${user}`);
        const datas  = [];
  
          // data.forEach(dt => {
          //   datas.push({
          //     command : dt.command
          //   });
          // });
  
          return DataCreated(
            res,
            messages,
          );
    
        });
          
        } catch (error) {
          console.log(error)
        }
      }

  grantAllTablesToAllSchemas = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;

    if (schemas === null || user === null){
      return BadRequest(res, "Data not valid");
    }


    try {
    this.#pgsql.grantAllTablesToAllSchemas(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

        // data.forEach(dt => {
        //   datas.push({
        //     command : dt.command
        //   });
        // });

        return DataCreated(
          res,
          messages,
        );
  
      });
      } catch (error) {
        console.log(error)
      }
    }

    grantSelectAllTablesToAllSchemas = (req, res) => {
      const messages = [];
      const schemas = req.body.schemas;
      const user = req.body.user;
  
      if (schemas === null || user === null){
        return BadRequest(res, "Data not valid");
      }
  
  
      try {
      this.#pgsql.grantSelectAllTablesToAllSchemas(req, schemas, user, (err, data) => {
        if (err) {
          messages.push('Internal error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }
  
        messages.push(`Granted user ${user}`);
        const datas  = [];
  
          data.forEach(dt => {
            datas.push({
              command : dt.command
            });
          });
  
          return DataCreated(
            res,
            messages,
          );
    
        });
        } catch (error) {
          console.log(error)
        }
      }

  grantAllToSchema = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;
    
    if (schemas === null || user === null){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.grantAllToSchema(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
    } catch (error) {
      console.log(error)
    }
  }

  grantSelectAllToSchema = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;
    
    if (schemas === null || user === null){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.grantSelectAllToSchema(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
    } catch (error) {
      console.log(error)
    }
  }

  grantAllTablesToSchema = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;
    
    if (schemas === null || user === null){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.grantAllTablesToSchema(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
    } catch (error) {
      console.log(error)
    }
  }

  grantSelectAllTablesToSchema = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;
    
    if (schemas === null || user === null){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.grantSelectAllTablesToSchema(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
    } catch (error) {
      console.log(error)
    }
  }

  grantAllToDatabase = (req, res) => {
    const messages = [];
    const databases = req.body.databases;
    const user = req.body.user;
    
    if (databases === null || user === null){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.grantAllToDatabase(req, databases, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Granted user ${user}`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
    } catch (error) {
      console.log(error)
    }
  }

  createSchema = (req, res) => {
    const messages = [];
    const schemas = req.body.schemas;
    const user = req.body.user;
    
    if (schemas === null || user === null || schemas === '' || user === ''){
      return BadRequest(res, "Not Valid Data");
    }

    try {
    this.#pgsql.createSchema(req, schemas, user, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Schema berhasil dibuat`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
    } catch (error) {
      console.log(error)
    }
  }

  createDatabase = (req, res) => {
    const messages = [];
    const databases = req.body.databases;
    const user = req.body.user;
    
    if (databases === null || user === null || databases === '' || user === ''){
      return BadRequest(res, "Data not valid");
    }

    try {
    this.#pgsql.createDatabase(req, databases, user, (err, data) => {
      if (err) {
        console.log(err.code)
        if (err.code === `42P04`) {
          messages.push(`Database ${databases} already exists`);
          return BadRequest(res, messages);
        }
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Database berhasil dibuat`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
    } catch (error) {
      console.log(error)
    }
  }

  createUser = (req, res) => {
    const messages = [];
    const password = req.body.password;
    const user = req.body.user;
    
    if (password === null || user === null || password === '' || user === ''){
      return BadRequest(res, "Not Valid Data");
    }

    try {
    this.#pgsql.createUser(req, user, password, (err, data) => {
      if (err) {
        // console.log(err.code)
        if (err.code === `42710`) {
          messages.push(`User ${user} already exists`);
          return BadRequest(res, messages);
        }
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`User berhasil dibuat`);
      const datas  = [];

      console.log("data,", data.command)
        
        datas[0] = { command: data.command}

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
      } catch (error) {
        console.log(error)
      }
  }


  allSQL = (req, res) => {
    const messages = [];
    const sql = req.body.sql;
    
    if (sql === null || sql === ''){
      return BadRequest(res, "Not Valid Data");
    }

    try {
    this.#pgsql.allSQL(req, sql, (err, data) => {
      if (err) {
        
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Berhasil`);
      const datas  = [];

      // console.log("data,", data)
        
        // datas[0] = { command: data.command}
        // datas.command = data.command
        datas.push({data: data.rows})
        datas.push({command : data.command})

        // console.log(datas)

        return Ok(
          res,
          messages,
          datas
        );
  
      });
      
      
      } catch (error) {
        console.log(error)
      }
  }

  createCron = (req, res) => {
    const messages = [];
    const datacron = {
      // id: uuid(),
      "PG_DATABASE": req.body.PG_DATABASE,
      "PG_HOST": req.body.PG_HOST,
      "PG_PORT": req.body.PG_PORT,
      "PG_USER": req.body.PG_USER,
      "SQL": req.body.SQL,
      "type": req.body.type,
      "start": req.body.start,
      "total_looping": req.body.total_looping,
      "increment_looping": req.body.increment_looping,
      "status": req.body.status
    };

    console.log(datacron)
  
    try {
    this.#pgsql.createCron(datacron, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Cron berhasil dibuat`);

        return DataCreated(
          res,
          messages,
        );
  
      });
      
      
    } catch (error) {
      console.log(error)
    }
  }

  getCron = (req, res) => {
    const messages = [];

    try {
    this.#pgsql.getCron(req, (err, data) => {
      if (err) {
        messages.push('Internal error');
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push(`Cron berhasil ditemukan`);
      const users  = [];


      // const dataArray = Object.keys(data).map((key) => {
      //   console.log(key)
      // });
  

      const dataArray = Object.keys(data).map((key) => ({
        // id: key,
        key: key,
        ...data[key]
      }));
      
      // data.forEach(user => {
      //   users.push({
      //     user : user.id
      //   });
      // });
      

      console.log("data", dataArray)
      return Ok(
        res,
        messages,
        dataArray
      );
 
    });
       
    } catch (error) {
      console.log(error)
    }
  }
  

}
  module.exports = { PgsqlController }
