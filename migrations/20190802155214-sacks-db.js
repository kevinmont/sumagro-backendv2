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
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      length: 11
    },
    description:{
      type:'string',
      length:255
    },
    used:{
      type:'boolean'
    },
    userid:{
      type: 'string',
      length: 255,
      notNull: true,
      foreignKey: {
        name: 'FK_SACKS_USERS',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    coordenatesid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_COORDENATES_SAKCS',
        table: 'coordenates',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    dateaplicated:{
      type:'string',
      length:255
    },
    inplot:{
      type:'boolean'
    },
    operator:{
      type:'string',
      length:255
    },
    clave:{
      type: 'string',
      length: 255,
      notNull: true,
      foreignKey: {
        name: 'FK_SACKS_DATABASE',
        table: 'database',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'codigo'
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
