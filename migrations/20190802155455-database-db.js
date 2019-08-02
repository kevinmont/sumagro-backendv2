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
      type:'varchar',
      primaryKey:true,
      notNull:true
    },
    campo:{
      type:'varchar',
      length:255
    },
    productor:{
      type:'varchar',
      length:255
    },
    curp:{
      type:'varchar',
      length:255
    },
    rfc:{
      type:'varchar',
      length:255
    },
    addressid:{
      type:'int',
      foreignKey:{
        name:'addressid',
        table:'address',
        mapping:'id'
      }
    },
    ciclo:{
      type:'varchar',
      length:255
    },
    nombreciclo:{
      type:'varchar',
      length:255
    },
    order:{
      type:'varchar',
      length:255
    },
    fechasiembra:{
      type:'varchar',
      length:255
    },
    ejidolocalidad:{
      type:'varchar',
      length:255
    },
    lote:{
      type:'varchar',
      length:255
    },
    nombrelote:{
      type:'varchar',
      length:255
    },
    superficie:{
      type:'varchar',
      length:255
    },
    superficieautorizada:{
      type:'varchar',
      length:255
    },
    rendimientoha:{
      type:'varchar',
      length:255
    },
    toneladas:{
      type:'varchar',
      length:255
    },
    variedad:{
      type:'varchar',
      length:255
    },
    agr:{
      type:'varchar',
      length:255
    },
    tabla:{
      type:'varchar',
      length:255
    },
    fechacosecha:{
      type:'varchar',
      length:255
    },
    toneladascosechadas:{
      type:'varchar',
      length:255
    },
    datosarcgis:{
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
    conceptoapoyo:{
      type:'varchar',
      length:255
    },
    formula:{
      type:'varchar',
      length:255
    },
    pesos:{
      type:'varchar',
      length:255
    },
    bultos:{
      type:'varchar',
      length:255
    },
    fechaemision:{
      type:'date'
    },
    ingenioid:{
      type:'int',
      foreignKey:{
        name:'ingenioid',
        table:'ingenio',
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
