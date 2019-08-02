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
  db.createTable('aplicated',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true
    },
    coordenatesid:{
      type:'int',
      foreignKey:{
        name:'coordenatesid',
        table:'coordenates',
        mapping:'id'
      }
    },
    description:{
      type:'varchar',
      length:255
    },
    inplot:{
      type:'boolean'
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
    dateaplicated:{
      type:'date'
    },
    ingenioid:{
      type:'int',
      foreignKey:{
        name:'ingenioid',
        table:'ingenio',
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
