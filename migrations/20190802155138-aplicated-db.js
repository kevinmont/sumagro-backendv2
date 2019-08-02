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
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      length: 11
    },
    coordenatesid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_COORDENATES_APLICATED',
        table: 'coordenates',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    description:{
      type:'string',
      length:255
    },
    inplot:{
      type:'boolean'
    },
    used:{
      type:'boolean'
    },
    dateaplicated:{
      type:'string',
      length:255
    },
    ingenioid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_INGENIOS_APLICATED',
        table: 'ingenios',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    operator:{
      type:'string',
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
