import { ingeniosTypes } from "../models/ingenio";
import * as log4js from 'log4js';
const logger = log4js.getLogger('ReportTemplate');
logger.level='info';
export class ReportTemplate{
    getReport(from:string,to:string,type:string,data:any){
        return this.getHead(from,to,type) + this.getBody(data);
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

    getBody(data:any){
        let totalTypes:any = {};
        for(let item of data){
            
            let dateOfItem = new Date(item.date);
            let keyObject:string = dateOfItem.getFullYear().toString()+'/'+(dateOfItem.getMonth()+1).toString()  +'/'+ dateOfItem.getDate().toString(); 
            logger.info(dateOfItem.getFullYear(), dateOfItem.getMonth()+1, dateOfItem.getDate());
            if(totalTypes[item.description]){
                if(totalTypes[item.description][keyObject]){
                    totalTypes[item.description][keyObject] +=1;
                }else{
                    totalTypes[item.description][keyObject]=1;
                }
            }else{
                totalTypes[item.description]={};
                totalTypes[item.description][keyObject]=1;
            }
        }
        logger.info(JSON.stringify(totalTypes));
        return this.getRows(totalTypes);
    }

    getRows(items:any){
        let body = '';
        let keys = Object.keys(items);
        for(let typeSack of keys){
            body += `
            <tr class="border">
                <td>
                Producto: ${typeSack}
                </td>
                <td colspan="2">
                    Descripcion: ${typeSack}
                </td>
            </tr>
            <tr>
                <td>
                Almacen: 1
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
            for(let date of  datesOfTypeSacks){
            body +=`
                <td>${date}</td>
                <td></td>
                <td>${items[typeSack][date]}</td>
                `
            }
            body +='</tr>';
    }
        body +=  ` </table>
                    </div>
                    </body>
                    </html> `;
                    logger.info("BODY PDF",body);
        return body;

    }
}