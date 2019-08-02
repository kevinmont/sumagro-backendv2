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
  db.createTable('intansit',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true
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
      },
      operator:{
        type:'varchar',
        length:255
      },
      operationunit:{
        type:'varchar',
        length:255
      },
      plates:{
        type:'varchar',
        length:255
      },
      orderid:{
        type:'int',
        foreignKey:{
          name:'irderid',
          table:'orders',
          mapping:'id'
        }
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
