import { ingeniosTypes } from "../models/ingenio";
import * as log4js from 'log4js';
import Mysql from "./mysql";
const logger = log4js.getLogger('ReportTemplate');
logger.level='info';
export class ReportTemplate{
    public clientMysql : Mysql;
    constructor(mysql: Mysql){
        this.clientMysql = mysql;
    }
    async getReport(from:string,to:string,type:string,data:any,typeFormat:string){
        if(typeFormat == 'client'){
            return this.getHeadByClient(from,to,type)+ await this.getBodyByClient(data);
        }else{
        return this.getHead(from,to,type) + this.getBodyByProduct(this.getRowsByProduct(data));
        }
    }

    getHead(from:string,to:string,type:string){
        let ingeniosTypesOptions:any = ingeniosTypes;
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            </head>
                <style>
                    h2 ,h1,div {
                        text-align: center
                    }
                    table {
                        margin: 0 auto;
                        border-collapse:collapse;
                    }
                    .border{
                        border-top:1px solid black
                    }
                    .borderbottom {
                        border-bottom: 1px solid black
                    }
                </style>
            <body>
                <h2>FERTILIZANTES SUMAGRO, S.A. DE C.V.</h2>
                    <h1>Resumen de movimientos</h1>
            <div>
                <table class="border">
                    <tr>
                        <td>Productos de: ${ingeniosTypesOptions[type]}</td>
                        <td></td>
                        <td>Tipo de documento: ${ingeniosTypesOptions[type]}</td>
                    </tr>
                    <tr>
                        <td>Desde fecha: ${from}</td>
                        <td>Hasta fecha: ${to}</td>
                        <td>Documento: ${ingeniosTypesOptions[type]}</td>
                    </tr>
                    <tr>
                        <td>Considerando todos los conceptos</td>
                    </tr>
        `
    }

    getRowsByProduct(products:any){
        let totalTypes:any = {};
        for(let product of products){ 
            let dateOfItem = new Date(product.date);
            let keyObject:string = dateOfItem.getFullYear().toString()+'/'+(dateOfItem.getMonth()+1).toString()  +'/'+ dateOfItem.getDate().toString(); 
            logger.info(dateOfItem.getFullYear(), dateOfItem.getMonth()+1, dateOfItem.getDate());
            if(totalTypes[product.description]){
                if(totalTypes[product.description][keyObject]){
                    totalTypes[product.description][keyObject] +=1;
                }else{
                    totalTypes[product.description][keyObject]=1
                }
            }else{
                totalTypes[product.description]={};
                totalTypes[product.description][keyObject]=1;
            }
        }
        logger.info(JSON.stringify(totalTypes));
        return totalTypes;
    }

    getBodyByProduct(items:any){
        let body = '';
        let keys = Object.keys(items);
        for(let typeSack of keys){
            body += `
            <tr class="border">
                <td>
                Producto: ${typeSack}
                </td>
                <td colspan="2">
                    Descripción: ${typeSack}
                </td>
            </tr>
            <tr>
                <td>
                Almacén: 1
                </td>
            </tr>
            <tr>
                <td>
                fecha
                </td>
                <td> </td>
                <td>Cantidad</td>
            </tr>
            <tr>`;
            let datesOfTypeSacks = Object.keys(items[typeSack]);
            let totalCounts = 0;
            for(let date of  datesOfTypeSacks){
            body +=`
                <td>${date}</td>
                <td>Subtotales:</td>
                <td class="borderbottom">${items[typeSack][date]}</td>
                `
            totalCounts += items[typeSack][date];
            }
            body +=`<td></td>
            <td>Subtotales producto:</td>
            <td class="borderbottom">${totalCounts}</td></tr>`;
    }
        body +=  ` </table>
                    </div>
                    </body>
                    </html> `;
        return body;

    }


    getByClient(from:string,to:string,type:string,data:any){
        return this.getHeadByClient(from,to,type) + this.getBodyByClient(data);
    }

    getHeadByClient(from:string,to:string,type:string){
        let ingeniosTypesOptions:any = ingeniosTypes;
        return `
                    <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Por Cliente</title>
            </head>
            <style>
            
                h2 ,h1,div {
                    text-align: center
                }
                table {
                    margin: 0 auto;
                    border-collapse:collapse;
                }
                .border{
                    border-top:1px solid black
                }
                .borderbottom{
                    border-bottom:1px solid black
                }
                </style>
                <body>
                    <h2>FERTILIZANTES SUMAGRO, S.A. DE C.V.</h2>
                    <h1>Ventas por cliente</h1>
                <table class="border">
                    <tr class="border">
                        <td>Producto:</td>
                        <td>${ingeniosTypesOptions[type]}</td>
                        <td></td>
                        <td>Tipo de documento</td>
                        <td>${ingeniosTypesOptions[type]}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center">Almacen</td>
                        <td></td>
                        <td>Documento:</td>
                        <td colspan="3">${ingeniosTypesOptions[type]}</td>
                    </tr>
                    <tr>
                        <td>Cliente</td>
                        <td colspan="2">Todos</td>
                        <td>Desde fecha:</td>
                        <td>${from}</td>
                        <td>Hasta fecha:</td>
                        <td>${to}</td>
                    </tr>
                    <tr>
                        <td colspan="3"></td>
                        <td>Vendedor:</td>
                        <td colspan="3">Todos</td>
                    </tr>
                    `
    }

    async getBodyByClient(products:any){
        let objectSplit:any = {};
        for(let product of products){
            if(objectSplit[product.ingenioid]){
                if(objectSplit[product.ingenioid][product.description]){
                    objectSplit[product.ingenioid][product.description]+=1;
                }else{
                    objectSplit[product.ingenioid][product.description] = 1;
                }
            }else{
                objectSplit[product.ingenioid] ={};
                objectSplit[product.ingenioid][product.description] = 1;
            }
        }
        let keys = Object.keys(objectSplit);
        let body = '';
        for(let ingenioid of keys){
            body += await this.getRowsByClient(ingenioid,objectSplit[ingenioid]);
        };
        body += "</table></body></html>";
        return body;
    }

    async getRowsByClient(ingenioId:string,products:any){
        logger.info("PRODUCTS",products);
        let query = `select name from ingenios where id ='${ingenioId}'`;
        let resultQuery:any = await this.clientMysql.query(query);
        logger.info("result",resultQuery);
        let rowHead:any = `
        <tr class="border"><td>Cliente:</td><td> ${ingenioId} </td><td colspan="6">Nombre: ${resultQuery[0].name}<td></tr>
        <tr class="border"><td colspan="3" style="text-align: center">Almacen</td><td colspan="5">1</td> </tr>`;
        
        let keysProducts = Object.keys(products);
        let totalCounts = 0;
        rowHead+=`<tr class="borderbottom"><td>Producto</td><td colspan="3">Descripción</td><td colspan="2">U.S.</td><td colspan="2">Cantidad</td></tr>`;
        for(let product of keysProducts){
            rowHead += `
            <tr><td > ${product} </td><td colspan="3">${product}</td><td colspan="2">BULTOS</td><td colspan="2">${products[product]}</td></tr>
            `;
            totalCounts += products[product];
        }

        rowHead+=`<tr ><td >  </td><td colspan="3"></td><td>Total del cliente:</td><td ></td><td colspan="2" class="border">${totalCounts}</td></tr>`

         
        return rowHead;
      
    }

}