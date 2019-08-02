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
  db.createTable('qrdata',{
    id:{
      type:'int',
      primaryKey:true,
      notNull:true
    },
    bultos:{
      type:'int'
    },
    codigo:{
      type:'varchar',
      length:255
    },
    curp:{
      type:'varchar',
      length:255
    },
    fechadeemision:{
      type:'date',
      length:255
    },
    formula:{
      type:'varchar',
      length:255
    },
    coordenatesid:{
      type:'int',
      foreignKey:{
        name:'coordenatesid',
        table:'coordenates',
        mapping:'id'
      }
    },
    productor:{
      type:'varchar',
      length:255
    },
    superficie:{
      type:'varchar',
      length:255
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
