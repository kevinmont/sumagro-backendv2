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
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement:true,
      length: 11
    },
    bultos:{
      type:'int',
      length: 11
    },
    codigo:{
      type:'string',
      length: 255
    },
    fechadeemision:{
      type:'string',
      length: 255
    },
    formula:{
      type:'string',
      length: 255
    },
    coordenateid:
    {
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_COORDENATES',
        table: 'coordenates',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    productor:{
      type:'string',
      length: 255
    },
    superficie:{
      type:'string',
      length: 255
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
