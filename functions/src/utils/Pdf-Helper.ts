//import { SubOrders} from '../models/SubOrders';
import { Order } from '../models/Order'
import LOGO from '../models/Logo';
import * as QRCode from 'qrcode';
export default class PdfHelper{
    createRows(subOrders:any){
        let content = "";
        subOrders.forEach((element:any)=>{
            content=content+`<tr><td style="text-align: center; border: 1px solid black;"><span>${element.quantity}</span></td>`+
            `<td style="text-align: center; border: 1px solid black;"><span>${element.received}</span></td>`+
            `<td style="text-align: center; border: 1px solid black;"><span>${element.description}</span></td>`+
            `<td style="text-align: left; border: 1px solid black;">$</td>`+
            `<td style="text-align: left; border: 1px solid black;">$</td></tr>\n`;
        });
        return content;
    }   

    head(order:Order){
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Sumagro</title>
        </head>
        <body>
            <span style="margin-left: 30%;"><strong>SERVICIO Y SUMINISTO DE MATERIALES AGRICOLAS, S DE RL DE CV</strong></span>
            <br>
            <span style="margin-left: 60%;"><strong>R.F.C. SSM090522P82</strong></span>
            <br><br><br>
            <span style="margin-left: 30%; font-size: 90%;">CARRETERA FEDERAL CORDOBA-VERACRUZ KM 10 LOTE 195 MANZANA 4</span>
            <br>
            <span style="margin-left: 40%; font-size: 90%;">VENTA PARADA, AMATLAN DE LOS REYES, VER. C.P. 94946</span>
            <br>
            <span style="margin-left: 60%; font-size: 90%;">TEL. 271 71 4 88 80</span>
            <br><br>
            <br>
            <span style="margin-left: 61%;"><strong>REM- No. </strong></span><span style="margin-left: 10px;">${order.remissionNumber}</span>
            <br>
                <span style="margin-left: 10%;"><strong>CLIENTE:</strong></span><span > <strong>${order.client}</strong></span>
        
            <br><br>
            <span style="margin-left: 61%;"> <strong>FECHA:</strong> </span><span>${order.shippingDate}</span><br>
            <span style="margin-left: 10%;"><strong>DOMICILIO:</strong></span><span style="margin-left: 10px;"><strong>${order.clientAddress}</strong></span>
            <br>
            
            <br>
            <table style="border-collapse: collapse; width: 80%; margin-left: 10%;margin-bottom: 200px;">
                <thead>
                    <th style=" border: 1px solid black;">CANTIDAD</th><th style=" border: 1px solid black;">Unidad</th><th style=" border: 1px solid black;">DESCRIPCION</th><th style=" border: 1px solid black;">PRECIO UNIT.</th><th style=" border: 1px solid black;">TOTAL</th>
                </thead>
                <tbody>
                    <tr><td colspan="5" style="height: 10px;"> </td></tr>`;
    }

    foot(order: Order){
        return `
        <tr>
                <td colspan="3" > </td>
                <td style="text-align: center;">TOTAL</td>
                <td style="text-align: left; border: 1px solid black;">$ </td>
            </tr>
            <tr>
                    <td colspan="3" > <strong>OBSERVACIONES: </strong></td>
                    <td style="text-align: center;">ANTICIPO</td>
                    <td style="text-align: left;; border: 1px solid black;">$ </td>
            </tr>
            <tr>
                <td colspan="5" style="height: 10px;"></td>
            </tr>
            <tr>
                    <td > <strong>OPERADOR: </strong></td>
                    <td colspan="2" style="text-align: left;">${order.operator}</td>
                    <td style="text-align: center;">RESTA</td>
                    <td style="text-align: left;">$ </td>
            </tr>
            <tr>
                <td><strong>UNIDAD</strong></td>
                <td><strong>${order.operationUnit}</strong></td>
                <td colspan="3"></td>
            </tr>
            <tr>
                    <td><strong>PLACAS</strong></td>
                    <td><strong>${order.plates}</strong></td>
                    <td colspan="3"></td>
                </tr>
        </tbody>
        
    </table>
    
    <br>
    <br>
    <span  style="margin-left: 30%;">ENTREGA</span><span style="margin-left: 30%">RECIBE</span>
</body>
</html>`;
    }


    formulas(subOrders:any){
        let content = "";
        subOrders.forEach((element:any)=>{
            content=content+`<li><span>${element.description}</span></li>\n`;
        });
        return content;
    }


    cantFormular(subOrders:any){
        let content = "";
        subOrders.forEach((element:any)=>{
            content=content+`<li><span>${element.quantity}</span></li>\n`;
        });
        return content;
    }

    getChargeFormat(order:any){
        let currentDate = new Date();
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Sumagro</title>
        </head>
        <body>
            <div>
            <div style="float: left; "><img width="200px;" height="100px;" src="${LOGO.data}"></div>
            <div style="float: rigth;">
                <span style="font-size: 110%; margin-left: 5%;"><strong>FERTILIZANTES SUMAGRO S.A DE C.V</strong></span>
                <span style="margin-left: 33%; font-size: 110%;"><strong>CODIGO: FODCA01</strong></span>
            </div>
        
            </div>
            <br>
            
            
            <table style=" border-collapse: collapse;  margin-bottom: 200px;">
                <thead>
                    <th colspan="5" style="text-align: center;">FORMATO DE CARGA</th>
                </thead>
                <tbody>
                    <tr><td colspan="5" style="height: 10px;"> </td></tr>
                    <tr>
                        <td  colspan="2" style="text-align: center;">
                            <span>FECHA</span>
                        </td>
                        <td style="text-align: center; ">
                                <span>HORA DE ENTRADA</span>
                        </td>
                        <td></td>
                        <td style="text-align: center;">
                                <span>HORA DE SALIDA</span>
                        </td>
                       
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                        <td colspan="2" style="text-align: center;"> ${currentDate.getDate() +`/`+ (currentDate.getMonth()+1)+`/`+currentDate.getFullYear()}</td>
                        <td style="text-align: center;">${ (order.dateEntrance)?'<u>'+order.dateEntrance+'</u>':'______:______'}</td>
                        <td></td>
                        <td style="text-align: center;">${(order.dateOutput)?'<u>'+order.dateOutput+'</u>':'______:______'}</td>
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td colspan="5"  style="text-align: center;  background-color: rgba(233, 230, 230, 0.945);"> <strong>DATOS DE LA UNIDAD TRANSPORTISTA</strong></td>
                            
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td  > <strong>OPERADOR: </strong></td>
                            <td colspan="4">${order.operator}</td>
                            
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr >
                            <td > <strong>FLETERA: </strong></td>
                            <td>${order.flet}</td>
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td  > <strong>UNIDAD: </strong></td>
                            <td>${order.operationUnit}</td>
                            <td   style="text-align: right;"> <strong>MARCA: </strong></td>
                            <td colspan="2" style="padding-left : 5%;"> ${order.mark}</td>
                            
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td  > <strong>MODELO: </strong></td>
                            <td>${order.modelunit}</td>
                            <td   style="text-align: right;"> <strong>PLACAS: </strong></td>
                            <td colspan="2" style="padding-left : 5%;">  ${order.plates}</td>
                        
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td colspan="5"  style="text-align: center; background-color: rgba(233, 230, 230, 0.945);"> <strong>DATOS DE CARGA</strong></td>
                            
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td  > <strong>PRODUCTO: <ul>${this.formulas(order.subOrders)}</ul></strong></td>
                            <td><strong>CANTIDAD: <ul style='list-style: none;'>${this.cantFormular(order.subOrders)}</ul></strong></td>
                            <td   style="text-align: right;"> <strong>PESO TOTAL: </strong></td>
                            <td colspan="2" style="padding-left : 5%;">  _________________</td>
                            
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td  > <strong>DESTINO: </strong></td>
                            <td>${order.clientAddress}</td>
                            <td   style="text-align: right;"> <strong>CLIENTE: </strong></td>
                            <td colspan="2" style="padding-left : 5%;"> ${order.client}</td>
                        
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr><td></td><td colspan="2">CABECERA: ______________</td><td colspans="2">___________________</td></tr>
                    <tr>
                        <td colspan="5">
                            <ul style="list-style: none;">
                                <li style="margin: 10px;">1.-</li>
                                <li style="margin: 10px;">2.-</li>
                                <li style="margin: 10px;">3.-</li>
                                <li style="margin: 10px;">4.-</li>
                                <li style="margin: 10px;">5.-</li>
                                <li style="margin: 10px;">6.-</li>
                                <li style="margin: 10px;">7.-</li>
                                <li style="margin: 10px;">8.-</li>
                                <li style="margin: 10px;">9.-</li>
                                <li style="margin: 10px;">10.-</li>
                                <li style="margin: 10px;">11.-</li>
                                <li style="margin: 10px;">12.-</li>
                                <li style="margin: 10px;">13.-</li>
                                <li style="margin: 10px;">14.-</li>
                            </ul>
                        </td>
                    </tr>
                    <tr><td colspan="5" style="height: 20px;"> </td></tr>
                    <tr>
                            <td colspan="2" style="text-align: center;">_______________________________</td>
                            
                            <td></td>
                            
                            <td colspan="2" style=" text-align: center">  _______________________________</td>
                        
                    </tr>
                    <tr>
                            <td colspan="2" style="text-align: center;">NOMBRE Y FIRMA DEL OPERADOR</td>
                            
                            <td></td>
                            
                            <td colspan="2" style="text-align: center;">  NOMBRE Y FIRMA DEL EMBARQUES</td>
                        
                    </tr>
                </tbody>
                
            </table>
            
           
        </body>
        </html>`;
    }
    async getRemissionDocument(orders:any){
        let content = this.head(orders)+this.createRows(orders.subOrders)+this.foot(orders);
        return content;
    }

    headVale(){
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Vales</title>
        </head>
        <body>`;
    }

    bodyVale(vale:any,qr:any,totalBultos:number){
        return `
            <table width="100%" border="0" style="border:1px solid #000000; margin-bottom: 48px;">
                <tr style="height: 40px;">
                    <td>Valido por:</td>
                    <td colspan="2"><span style="text-decoration: underline; text-aling: center;">${totalBultos} bultos </span></td>
                    <td> Fecha de emision:</td>
                    <td><span style="text-decoration: underline">${vale.fechaemision}</span></td>
                </tr>
                <tr style="height: 40px;">
                    <td>A favor de:</td>
                    <td colspan="2"><span style="text-decoration: underline">${vale.productor.split("-").join(" ")}</span></td>
                    <td> CURP:</td>
                    <td><span style="text-decoration: underline">${vale.curp}</span></td>
                </tr>
                <tr style="height: 40px;">
                    <td colspan="2">Concepto de apoyo autorizado:</td>
                    <td colspan="3">${vale.conceptoapoyo}</td>
                </tr>
                <tr style="height: 40px;">
                    <td colspan="2"> Superficie autorizada en hectáreas:</td>
                    <td colspan="3">${vale.superficieautorizada}</td>
                    
                </tr>
                <tr style="height: 40px;"> 
                <td colspan="2"><img src="${qr}" width="200px" height="200px"></td>
                <td colspan="3" style="text-align: center"> Vigencia de 90 días a partir de su emisión.</td>
                </tr>
            </table>
           `;
    }

    footvale(){
        return `
        </body>
        </html>`;
    }

    async generateVale(records:any){
        let content = this.headVale();
        let properties:any = {};
        
        for(let i=0;i<records.length;i++){
           properties['productor'] = records[i].productor;
           properties['productos']=[];
            let keys= Object.keys(records[i]);
            let totalBultos = 0;
            for(let key of keys){
                if(key!='productor' && key!="fechaemision" && key!='curp' && key!='conceptoapoyo' && key!='superficieautorizada'){
                properties['productos'].push({formula: key,quantity: records[i][key]});
                totalBultos += records[i][key]
                }
            }
            let qr = await QRCode.toDataURL(JSON.stringify(properties));
            console.log("qr:",qr);
            content= content + this.bodyVale(records[i],qr,totalBultos);
                
            }
           
        
        
        content = content + this.footvale();
    
        return content;
    }
}