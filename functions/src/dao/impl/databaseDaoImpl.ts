import * as log4js from "log4js";
import Mysql from "../../utils/mysql";
import { AbstractDao } from "../abstractDao";
import { DatabaseDao } from "../databaseDao";

const logger = log4js.getLogger("sumagro.dao.impl.DatabaseDaoImpl");

export class DatabaseDaoImpl extends AbstractDao implements DatabaseDao {

    constructor(db: Mysql) {
        super(db)
    }

    async saveDatabase(arr: any, addressId: any, coordenatesId: any, ingenioId:any) {
        logger.info('DAO: Method RegistredDatabase Startting');
        let sql = "INSERT INTO `sumagro-dev`.`database`(zona,codigo,productor,curp,rfc,addressid,ciclo,nombreciclo,`order`,"+
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
            return await this.db.query(sql);
        }catch(e){
           logger.error('Hubo un error' + e);
           return arr[1];
        }
        
    }

    async getRecordsByIngenioId(ingenioId: number){
        logger.info("DAO: Method getRecordsByIngenioId Startting");
        let response = await this.db.query('SELECT * from `sumagro-dev`.database'+` where ingenioid=${ingenioId}`);
        logger.info("DAO: Method getRecordsByIngenioId Ended");
        return response;
    }

    async getParcelaRest(codigo: string){
        logger.info("DAO: Method getParcelaRest Starting");
        let query="SELECT * from `sumagro-dev`.parcelas where "+`codigo='${codigo}'`
        logger.info("DAO: Method getParcelaRest Ended");
        return this.db.query(query);
    }

    async updatedParcelasRest(count: number, codigo: string, dateAplicated: string){
        logger.info("DAO: Method getParcelaRest Starting");
        let query="UPDATE `sumagro-dev`.parcelas set aplicated="+ `${count},set date='${dateAplicated}' where codigo='${codigo}'`;
        logger.info("DAO: Method getParcelaRest Ended");
        return this.db.query(query);
    }

    async getEjidoByIngenio(ingenioId: any){
        logger.info(`DAO: getOrdersByIngenio Startting`);
        let sql='SELECT DISTINCT ejidolocalidad from `sumagro-dev`.database'+` where ingenioid=${ingenioId}`;
        logger.debug(`DAO: getOrdersByIngenio ending`);
        return await this.db.query(sql);
    }

    async getRecordsByEjido(ejido: string){
        logger.info("DAO: Method getRecordsByIngenioId Startting");
        let sql ='SELECT * from `sumagro-dev`.database'+` where ejidolocalidad='${ejido}'`;
        logger.info("DAO: Method getRecordsByIngenioId Ended");
        return await this.db.query(sql);
    }

    async updateProperty(codigo: string, type: string, value: string){
        let query = "update `database` set "+ `${type}='${value}' where codigo='${codigo}';`;
        logger.debug(query);
        let response = await this.db.query(query);
        return response;
    }

    async updatedParcelas(codigo: string, type: string, value: string){
        let query = "update `parcelas` set "+ `${type}='${value}' where codigo='${codigo}';`;
        logger.debug(query);
        let response = await this.db.query(query);
        return response;
    }

    async getCoordenatesIdsByProductor(productor: string){
        logger.info("DAO: Method getRecordsByIngenioId Startting");
        let sql ='SELECT codigo,coordenatesid from `sumagro-dev`.database'+` where productor='${productor}'`;
        logger.info("QUERY ",sql);
        logger.info("DAO: Method getRecordsByIngenioId Ended");
        return await this.db.query(sql);
    }

    async getRecordsByRango(ingenioId: number, rangoIni: number, rangoFin: number){
        logger.info("DAO: Method getRecordsByIngenioId Startting");
        let sql ="select distinct(formula),sum(bultos) as count,curp,fechaemision,productor from `sumagro-dev`.database"+` where ingenioid=${ingenioId} group by productor,formula LIMIT ${rangoIni},${rangoFin}`;
        logger.info("DAO: Method getRecordsByIngenioId Ended");
        return await this.db.query(sql);
    }

    async pendingQuantityRecords(ingenioId: number){
        logger.info("DAO: Method pendingQuantityRecords Startting");
        let sql ="select count(*) as count  from `sumagro-dev`.database where  codigo IN (select codigo from `sumagro-dev`.database where "+`ingenioid=${ingenioId} ) and (bultos='actualizando' or formula='actualizando' or pesos='actualizando'); `;
        logger.info("DAO: Method pendingQuantityRecords Ended");
        return await this.db.query(sql);
    }

    async getTotalRecords(ingenioId: number){
        logger.info("DAO: Method pendingQuantityRecords Startting");
        let sql ="select count(*) as count from `sumagro-dev`.database where"+` ingenioid=${ingenioId}; `;
        logger.info("DAO: Method pendingQuantityRecords Ended");
        return await this.db.query(sql);
    }
}