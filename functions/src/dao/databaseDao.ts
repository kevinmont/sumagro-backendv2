import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class DatabaseDao {
    public mysql: Mysql;

    constructor() {
        this.mysql = new Mysql();
    }

    async saveDatabase(arr: any, addressId: any, coordenatesId:any,ingenioId:any) {
        logger.info('DAO: Method RegistredDatabase Startting');
        let sql = "INSERT INTO `sumagro-dev`.`database`(campo,codigo,productor,curp,rfc,addressid,ciclo,nombreciclo,`order`,"+
            `fechasiembra,ejidolocalidad,lote,nombrelote,superficie,superficieautorizada,
            rendimientoha,toneladas,variedad,agr,tabla,fechacosecha,toneladascosechadas,datosarcgis,coordenatesid,
            conceptoapoyo,formula,pesos,bultos,fechaemision,ingenioid) values(
                '${arr[0]}','${arr[1]}','${arr[2]}','${arr[3]}','${arr[4]}',${addressId},'${arr[6]}','${arr[7]}',
                '${arr[8]}','${arr[9]}','${arr[10]}','${arr[11]}','${arr[12]}','${arr[13]}','${arr[14]}','${arr[15]}',
                '${arr[16]}','${arr[17]}','${arr[18]}','${arr[19]}','${arr[20]}','${arr[21]}','${arr[22]}',
                ${coordenatesId},'${arr[25]}','${arr[26]}','${arr[27]}','${arr[28]}','${arr[29]}',${ingenioId})`;
                console.log("slql: " + sql);
        logger.debug('DAO: Method RegistredDatabase Ending');
        try{
            return await this.mysql.query(sql);
        }catch(e){
           logger.error('Hubo un error' + e);
           return arr[1];
        }
        
    }
}