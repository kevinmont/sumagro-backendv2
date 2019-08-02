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
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      length: 11
    },
    orderid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_ORDER_SUBORDER',
        table: 'orders',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    captured:{
      type:'boolean'
    },
    description:{
      type:'string',
      length:255
    },
    quantity:{
      type:'int',
      length:11
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
