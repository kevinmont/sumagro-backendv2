import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger('Sumagro Report Dao');
logger.level = 'debug';
import {ReportTemplate} from '../utils/reportTemplate';
export default class SumagroReportDao{
     private mysql: Mysql;
    private reportTemplate : ReportTemplate;
    constructor(mysql: Mysql){
        this.mysql = mysql;
        this.reportTemplate = new ReportTemplate();
    }

    async getReportInfo(table:string,type:string,dateStart:string,dateEnd:string,data:any,ingenioName:string,subType?:string){
        return this.reportTemplate.getReport(table,type,dateStart,dateEnd,data,ingenioName,subType);
    }



    async getDataOfWarehouse(tableName:string,dateStart:string,dateEnd:string,ingenios:any,productos:any,ordenes:any){
        logger.info("DAO: sumagroReportDAO Method getDataOfWarehouse Starting");
        let queryIngenioIds = "";
        let orderIds = "";
        let productosIds ="";
        
        if(ingenios.length){
            queryIngenioIds =" (";
        for(let i=0;i<ingenios.length;i++){
            
            if(i!=ingenios.length-1){
            queryIngenioIds+= `a.ingenioid=${ingenios[i].ingenioId} or `
            ingenios[i].ordenes.forEach((orden:string) => {
                if(orderIds==""){
                    orderIds+=" ( ";
                }
                orderIds+=` a.orderid=${orden} or`;    
            });
                
            }else{
                queryIngenioIds+= `a.ingenioid=${ingenios[i].ingenioId} ) `;
                for(let index=0;index<ingenios[i].ordenes.length;index++){
                    if(index!=ingenios[i].ordenes.length-1){
                        if(orderIds==""){
                            orderIds+=" ( ";
                        }
                    orderIds+=` a.orderid=${ingenios[i].ordenes[index]} or`;
                    }else{
                        if(orderIds==""){
                            orderIds+=" ( ";
                        }
                    orderIds+=` a.orderid=${ingenios[i].ordenes[index]} )`;
                    }
                }
            }
        }
        }

        if(ordenes.length){
            for(let i=0;i<ordenes.length;i++){
            if(i<ordenes.length-1){
                if(orderIds==""){
                    orderIds+=" ( ";
                }
                orderIds+=` a.orderid=${ordenes[i]} or`;    
            }else{
                if(orderIds==""){
                    orderIds+=" ( ";
                }
                orderIds+=` a.orderid=${ordenes[i]} )`;    
            }
            }
        }
        if(productos.length){
            productosIds=" ( ";
            for(let i=0;i<productos.length;i++){
                if(i!=productos.length-1){
                productosIds+=` a.description='${productos[i]}' or `;
                }else{
                    productosIds+=` a.description='${productos[i]}' )`;
                }
            };
            
        }
        let compQuery ="";
        if(queryIngenioIds!=""){
            compQuery+=queryIngenioIds +" and ";
            if(orderIds!=""){
                compQuery+=orderIds+" and ";
                if(productosIds!=""){
                    compQuery+=productosIds + " and ";
                }
            }else if(productosIds!=""){
                compQuery+=productosIds+" and ";
            }
        }else if(orderIds!=""){
            compQuery+=orderIds +" and ";
            if(productosIds!=""){
                compQuery+=productosIds+ " and ";
            }
        }else if(productosIds!=""){
            compQuery+=productosIds+ " and";
        }
                
        let query = `select a.id,a.date,a.description,a.ingenioid,a.orderid,b.name,c.remissionnumber  from  ${tableName} as a,ingenios as b,orders as c where ${compQuery} a.ingenioid=b.id and a.orderid=c.id and a.date between '${dateStart}' and '${dateEnd}' group by ingenioid;`;
        console.log(query);
        logger.info("DAO: sumagroReportDAO Method getDataOfWarehouse Ended");
        return await this.mysql.query(query);
    }

    async getDataByProduct(ingenioId:number,productos:any,tableName:string,dateStart:string,dateEnd:string){
        logger.info("DAO: sumagroReportDAO Method getDataByProduct Starting");

        let products = "";

        if(productos.length){
            products+="and (";
            for(let i=0;i<productos.length;i++){
                if(i<productos.length-1){
                    products+=` description='${productos[i]}' or `;
                }else{
                    products+=` description='${productos[i]}' )`;
                }
            }
        }

        let query = `select distinct(description),count(description) as count,DATE_FORMAT(date,"%Y-%m-%d") as dateFormat FROM ${tableName} where ingenioid=${ingenioId} ${products} and date between '${dateStart}' and '${dateEnd}' group by description,dateFormat`;
        return await this.mysql.query(query);
    }


    async getAplicatedEntityInfo(ingenioId:number,zonas:[string],ejidos:[string],parcelas:[string],productos:[string],subType:string,dateStart:string,dateEnd:string,type:string){
        logger.info("DAO: sumagroReportDAO Method getAplicatedEntityInfo Starting");
        let query="";
        let zonasQuery="";
        let ejidosQuery="";
        let parcelasQuery = "";
        let productosQuery="";
        if(zonas.length){
            zonasQuery+="  ("
            for(let i=0;i<zonas.length;i++){
                if(i<zonas.length-1){
                    zonasQuery +=`a.zona='${zonas[i]}' or `;
                }else{
                    zonasQuery+=`a.zona='${zonas[i]}'`;
                }
            }
            zonasQuery+=") and "
        }
        if(ejidos.length){
            ejidosQuery+="  ("
            for(let i=0;i<ejidos.length;i++){
                if(i<ejidos.length-1){
                    ejidosQuery +=`a.ejido='${ejidos[i]}' or `;
                }else{
                    ejidosQuery+=`a.ejido='${ejidos[i]}'`;
                }
            }
            ejidosQuery+=") and "
        }
        
        if(parcelas.length){
            parcelasQuery+="  ("
            for(let i=0;i<parcelas.length;i++){
                if(i<parcelas.length-1){
                    parcelasQuery +=`a.codigo='${parcelas[i]}' or `;
                }else{
                    parcelasQuery+=`a.codigo='${parcelas[i]}'`;
                }
            }
            parcelasQuery+=") and "
        }

        if(productos.length){
            productosQuery+="  ("
            for(let i=0;i<productos.length;i++){
                if(i<productos.length-1){
                    productosQuery +=`b.formula='${productos[i]}' or `;
                }else{
                    productosQuery+=`b.formula='${productos[i]}'`;
                }
            }
            productosQuery+=") and "
        }

        let group = "";
        if(type=="producto"){
            group = "b.formula";
        }else if(type=="zona"){
            group="a.zona";
        }else if(type=="ejido"){
            group="a.ejido";
        }else if(type=="parcela"){
            group="a.codigo"
        }

        if(subType=="aplicated"){
        query = `select a.codigo as parcela,a.bultos as cantidad,a.productor,a.zona,a.date,a.ejido,b.formula as producto 
        from `+"`sumagro-dev`.parcelas as a, `sumagro-dev`.database as b"+` where a.aplicated=a.bultos and b.codigo=a.codigo 
        and a.ingenioid=${ingenioId} and ${ejidosQuery} ${parcelasQuery} ${zonasQuery} ${productosQuery}
         a.date between '${dateStart}' and '${dateEnd}' group by ${group};`;
        }else{
            query = `select a.codigo as parcela,a.bultos as cantidad,a.productor,a.zona,a.date,a.ejido,b.formula as producto 
            from `+"`sumagro-dev`.parcelas as a, `sumagro-dev`.database as b"+` where a.aplicated!=a.bultos and b.codigo=a.codigo 
            and a.ingenioid=${ingenioId} and ${ejidosQuery} ${parcelasQuery} ${zonasQuery} ${productosQuery} group by ${group};`;

            query = query.replace("and  group","group");
        }
        console.log("QUERY",query);
        logger.info("DAO: sumagroReportDAO getAplicatedEntityInfo Ended");
        
        return await this.mysql.query(query);
    }

    async getAplicatedOutParcel(dateStart:string,dateEnd:string){
        let object:any = {};
        logger.info("DAO: SumagroReportDAO method getAplicatedOutParcel Starting");
        let query = "select distinct(a.description),count(a.description) as count,a.id,a.operator,a.date from `sumagro-dev`.aplicated as a "+ `
        where a.used='1' and a.inplot='0' and a.date between '${dateStart}' and '${dateEnd}' group by a.operator
        `;
        let data:any = await this.mysql.query(query);
        for(let item of data){
            if(object[item.operator]){
                if(object[item.operator][item.description]){
                    object[item.operator][item.description]={
                        count:item.count,
                        date: item.date
                    };
                }else{
                    object[item.operator][item.description]={
                        count: item.count,
                        date: item.date
                    };
                }
            }else{
                object[item.operator] = {};
                object[item.operator][item.description]={
                    count: item.count,
                    date:item.date
                };
            }
        }

       let productores = Object.keys(object);
       logger.info("DAO: SumagroReportDAO method getAplicatedOutParcel Ended");
       if(productores.length){
           let queryOfParcel = "select a.codigo,a.zona,a.ejido from `sumagro-dev`.parcelas as a where a.bultos!=a.aplicated and a.productor in (";
                for(let productor of productores){
                    queryOfParcel+=`${productor},`;
                }
                queryOfParcel+=");";
                queryOfParcel.replace(",);",");");
        let parcelas:any  = await this.mysql.query(queryOfParcel);
                for(let parcela of parcelas){
                    if(object[parcela.productor].parcelas){
                        object[parcela.productor].parcelas.push(parcela);
                    }else{
                        object[parcela.productor].parcelas=[parcela];
                    }
                }
           return object;
       }else{
           return {};
       }
       

    }

}