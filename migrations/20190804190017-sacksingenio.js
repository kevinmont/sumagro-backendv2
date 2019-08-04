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
  db.createTable('sacksingenio',{
    id:{
      type:'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      length: 11
    },
    clave:{
      type:'string',
      length:255
    },
    description:{
      type:'string',
      length:255
    },
    ingenioid:{
      type:'int',
      unsigned:true,
      length:11,
      notNull:true,
      foreignKey:{
        name:'FK_INGENIOS_SACKSINGENIOS',
        table:'ingenios',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping:'id'
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
