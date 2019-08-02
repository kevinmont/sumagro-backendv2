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
  db.createTable('inventory',{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      length: 11
    },
    ingenioid:
    {
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_INGENIOS_INVENTORY',
        table: 'ingenios',
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
    operator:{
      type:'string',
      length:255
    },
    date:{
      type:'date'
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
