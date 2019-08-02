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
  db.createTable('database',{
    codigo:{
      type: 'string',
      notNull: true,
      primaryKey: true,
      length: 255
    },
    campo:{
      type:'string',
      length:255
    },
    productor:{
      type:'string',
      length:255
    },
    curp:{
      type:'string',
      length:255
    },
    rfc:{
      type:'string',
      length:255
    },
    addressid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_ADDRESS_DATABSE',
        table: 'address',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    ciclo:{
      type:'string',
      length:255
    },
    nombreciclo:{
      type:'string',
      length:255
    },
    order:{
      type:'string',
      length:255
    },
    fechasiembra:{
      type:'string',
      length:255
    },
    ejidolocalidad:{
      type:'string',
      length:255
    },
    lote:{
      type:'string',
      length:255
    },
    nombrelote:{
      type:'string',
      length:255
    },
    superficie:{
      type:'string',
      length:255
    },
    superficieautorizada:{
      type:'string',
      length:255
    },
    rendimientoha:{
      type:'string',
      length:255
    },
    toneladas:{
      type:'string',
      length:255
    },
    variedad:{
      type:'string',
      length:255
    },
    agr:{
      type:'string',
      length:255
    },
    tabla:{
      type:'string',
      length:255
    },
    fechacosecha:{
      type:'string',
      length:255
    },
    toneladascosechadas:{
      type:'string',
      length:255
    },
    datosarcgis:{
      type:'string',
      length:255
    },
    coordenatesid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_ICOORDENATES_DATABASE',
        table: 'coordenates',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    conceptoapoyo:{
      type:'string',
      length:255
    },
    formula:{
      type:'string',
      length:255
    },
    pesos:{
      type:'string',
      length:255
    },
    bultos:{
      type:'string',
      length:255
    },
    fechaemision:{
      type:'string',
      length:255
    },
    ingenioid:{
      type: 'int',
      unsigned: true,
      length: 11,
      notNull: true,
      foreignKey: {
        name: 'FK_INGENIOS_DATABASE',
        table: 'ingenios',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
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
