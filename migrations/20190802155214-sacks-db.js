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
  db.createTable('sacks',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true
    },
    description:{
      type:'varchar',
      length:255
    },
    used:{
      type:'boolean'
    },
    userid:{
      type:'int',
      foreignKey:{
        name:'userid',
        table:'users',
        mapping:'id'
      }
    },
    coordenatesid:{
      type:'int',
      foreignKey:{
        name:'coordenatesid',
        table:'coordenates',
        mapping:'id'
      }
    },
    dateaplicated:{
      type:'date'
    },
    inplot:{
      type:'boolean'
    },
    operator:{
      type:'varchar',
      length:255
    },
    clave:{
      type:'varchar',
      length:255,
      foreignKey:{
        name:'clave',
        table:'database',
        mapping:'codigo'
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
