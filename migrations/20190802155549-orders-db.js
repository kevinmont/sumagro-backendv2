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
  db.createTable('orders',{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement:true,
      length: 11
    },
    ingenioid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_INGENIOS_ORDES',
        table: 'ingenios',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    shippingdate:{
      type:'string',
      length:255
    },
    status:{
      type:'string',
      length:255
    },
    client:{
      type:'string',
      length:255
    },
    addressid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_ADDRESS_ORDER',
        table: 'address',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    dateentrance:{
      type:'string',
      length:255
    },
    dateoutput:{
      type:'string',
      length:255
    },
    flet:{
      type:'string',
      length:255
    },
    isshowed:{
      type:'boolean'
    },
    mark:{
      type:'string',
      length:255
    },
    modelunit:{
      type:'string',
      length:255
    },
    operationunit:{
      type:'string',
      length:255
    },
    operator:{
      type:'string',
      length:255
    },
    plates:{
      type:'string',
      length:255
    },
    remissionnumber:{
      type:'int',
      length:11
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
