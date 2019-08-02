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
      type:'int',
      primaryKey:true,
      notNull:true
    },
    ingenioid:{
      type:'int',
      foreignKey:{
        name:'ingenioid',
        table:'ingenio',
        mapping:'id'
      }
    },
    shippingdate:{
      type:'varchar',
      length:255
    },
    status:{
      type:'varchar',
      length:255
    },
    client:{
      type:'varchar',
      length:255
    },
    addressid:{
      type:'int',
      foreignKey: {
        name: 'addressid',
        table: 'coordenates',
        mapping: 'id'
      }
    },
    dateentrance:{
      type:'varchar',
      length:255
    },
    dateoutput:{
      type:'varchar',
      length:255
    },
    flet:{
      type:'varchar',
      length:255
    },
    isshowed:{
      type:'boolean'
    },
    mark:{
      type:'varchar',
      length:255
    },
    modelunit:{
      type:'varchar',
      length:255
    },
    operationunit:{
      type:'varchar',
      length:255
    },
    operator:{
      type:'varchar',
      length:255
    },
    plates:{
      type:'varchar',
      length:255
    },
    remissionnumber:{
      type:'int',
      foreignKey:{
        name:'remissionsnumber',
        table:'remissions',
        mapping:'count'
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
