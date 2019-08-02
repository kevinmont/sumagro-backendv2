'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('sumagrooutputs',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true
    },
    date:{
      type:'date'
    },
    description:{
      type:'varchar',
      length:255
    },
    ingenioid:{
      type:'int',
      foreignKey:{
        name:'ingenioid',
        table:'ingenio',
        mapping:'id'
      }
    },
    ingenioname:{
      type:'varchar',
      length:255
    },
    operator:{
      type:'varchar',
      length:255
    },
    orderid:{
      type:'int',
      foreignKey:{
        name:'orderid',
        table:'orders',
        mapping:'id'
      }
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
