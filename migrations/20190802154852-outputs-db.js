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
  db.createTable('outputs',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true,
    },
    description:{
      type:'varchar',
      length:255
    },
    operator:{
      type:'varchar',
      length:255
    },
    userid:{
      type:'varchar',
      foreignKey:{
        name:'userid',
        table:'users',
        mapping:'id'
      },
      ingenioid:{
        type:'int',
        foreignKey:{
          name:'ingenioid',
          table:'ingenios',
          mapping:'id'
        }
      },
      qrdataid:{
        type:'int',
        foreignKey:{
          name:'qrdataid',
          table:'qrdata',
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
