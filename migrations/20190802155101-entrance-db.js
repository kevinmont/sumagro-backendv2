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
  db.createTable('entrance',{
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
        table:'ingenios',
        mapping:'id'
      }
    },
    operatorid:{
      type:'int',
      foreignKey:{
        name:'operator',
        table:'users',
        mapping:'id'
      }
    },
    orderid:{
      type:'int',
      foreignKey:{
        name:'orderid',
        table:'orders',
        mapping:'id'
      }
    },
    operator:{
      type:'varchar',
      length:255,
      foreignKey:{
        name:'operator',
        table:'users',
        mapping:'email'
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
