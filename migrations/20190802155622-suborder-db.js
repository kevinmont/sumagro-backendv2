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
  db.createTable('suborder',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true
    },
    orderid:{
      type:'int',
      foreignKey:{
        name:'orderid',
        table:'orders',
        mapping:'id'
      }
    },
    captured:{
      type:'boolean'
    },
    description:{
      type:'varchar',
      length:255
    },
    quantity:{
      type:'int'
    },
    received:{
      type:'boolean'
    },
    status:{
      type:'boolean'
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
