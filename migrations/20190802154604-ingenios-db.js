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
  db.createTable('ingenios',{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement:true,
      length: 11
    },
    addressid:
    {
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_ADDRESS',
        table: 'address',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    email:{
      type:'string',
      length: 255
    },
    name:{
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
