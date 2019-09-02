import * as log4js from 'log4js';
import Mysql from './mysql';
const logger = log4js.getLogger('ReportTemplate');
logger.level='info';
export class ReportTemplate{
    private mysql:Mysql;
    constructor(mysql:Mysql){
        this.mysql= mysql;
    }
    reportTypes:any={
        entrance: "Reporte de entradas",
        aplicated: "Reporte de aplicados",
        outputs: "Reporte de salidas",
        intransit: "Reporte en transito",
        inventory: "Reporte de inventario",
        sumagrooutputs: "Reporte de salidas de almacen sumagro",
        sumagrointransit: "Reporte de ordenes en transito sumagro"
    };

    reportClases:any = {
        producto: "por producto",
        orden: "por orden"
    }

    reportParcelasType:any={
        producto: "por producto",
        ejido: "por ejido",
        zona:"por zona",
        parcela: "por parcela"
    }
    async getReport(clase:string,table:string,type:string,dateStart:string,dateEnd:string,data:any,ingenioData:any,ingenioAddress:any,subtype?:string){
        let response = "";
        let head= await  this.getHead(table,type,ingenioData[0].name,dateStart,dateEnd,ingenioAddress);
        let body ="";
        switch(table){
            case 'entrance':
                    body = await this.getBody(data,type);   
                    response= head+body;
                break;
            case 'outputs': 
                    body= await this.getBodyOnlyProducts(data);
                    response=head+body;
            break;
            case 'intransit':
                    body = await this.getBody(data,type);   
                    response= head+body;
                break;
            case 'inventory':
                    body = await this.getBodyOnlyProducts(data);   
                    response= head+body;
                break;
            case 'aplicated':
                
                if(subtype=="aplicated"){
                    if(type=="producto"){
                    head= await this.getHead(table,type,ingenioData[0].name,dateStart,dateEnd,ingenioAddress);
                    body = await this.getBodyOnlyProducts(data);
                    }else if(type=="ejido" || type=="parcela" || type=="zona"){
                        head= await this.getHeadParcelas(table,type,ingenioData[0].name,dateStart,dateEnd,ingenioAddress);
                        body = await this.getBodyOnlyParcelas(data,type);
                    }
                  
                }else if(subtype=="notaplicated"){
                    if(type=="producto"){
                        head= await this.getHeadParcelas(table,type,ingenioData[0].name,dateStart,dateEnd,ingenioAddress);
                        body = await this.getBodyOnlyParcelasNotAplicated(data);
                        }else if(type=="ejido" || type=="parcela" || type=="zona"){
                            head= await this.getHeadParcelas(table,type,ingenioData[0].name,dateStart,dateEnd,ingenioAddress);
                            body = await this.getBodyOnlyParcelasNotAplicatedByTypes(data,type);
                        }
                }else if(subtype=="outOfParcel"){
                     head= await this.getHeadParcelas(table,type,ingenioData[0].name,dateStart,dateEnd,ingenioAddress);
                     body = await this.reportOutOfParcel(data);
                }
                

                response = head+body;
                break;
            default:
               response = '<html><body>NO EXISTE ESA ENTIDAD</body></html>'
                break;
        }
        return response;
    }

    async reportOutOfParcel(data:any){
        let object:any = {};
        for(let item of data){
            if(object[item.operator]){
                if(object[item.operator][item.description]){
                    object[item.operator][item.description].push({
                        count: item.count,
                        date: item.date
                    });
                }else{
                    object[item.operator][item.description]=[{
                        count: item.count,
                        date: item.date
                    }];
                }
            }else{
                object[item.operator][item.description]=[{
                        count: item.count,
                        date: item.date
                }]
            }
        }
        let keys = Object.keys(object);
        let body="";
        let globalTotal=0;
        for(let item of keys){
            let parcelas:any = await this.mysql.query("select codigo,ejido,zona from `sumagro-dev`.parcelas "+ `where productor='${item}' and bultos>aplicated`);
            body+=`
            <tr class="border">
            <td>Parcela</td>
            <td>Ejido</td>
            <td>Zona</td>
            <td>Formula</td>
            <td>Fecha</td>
            <td>count</td>
            <td>operator</td>
            </tr>
            <tr>
            <td colspan="3">    
            `;
            let totalCount = 0;
            
            for(let parcela of parcelas){
                body+=`
                ${parcela.codigo}-${parcela.ejido}-${parcela.zona}\n
                `;    
            }
        for(let item2 of object[item]){
            body+=`</td>
            <td>${item2.description}</td>
            <td>${item2.date}</td>
            <td>${item2.count}</td>
            <td>${item2.operator}</td>
            </tr>`; 
        }
        body+=`
        <tr>
        <td colspan="7">Subtotal no aplicados: ${totalCount}</td>
        </tr>
        `;
        globalTotal = totalCount;
        }

        body+=`
        <tr class="border">
        <td colspan="7"> Total de no aplicados: ${globalTotal}</td>
        </tr>
        `;

        return body;
    }

    async getHead(table:string,type:string,ingenioName:string,dateStart:string,dateEnd:string,ingenioAddress:any){
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
                    <h1>${ingenioName}</h1>
                    <h1>${this.reportTypes[table]} ${(Object.keys(this.reportClases).includes(type))?this.reportClases[type]:this.reportParcelasType[type]}</h1>
            <div>
                <table class="border">
                    <tr>
                        <td>Tipo de documento: ${this.reportTypes[table]}</td>
                        <td colspan="2">Direccion: ${ingenioAddress[0].calle},#${ingenioAddress[0].numero} ${ingenioAddress[0].ciudad}</td>
                    </tr>
                    <tr>
                        <td>${(type=='producto')?'Producto:':'Orden'}: Todos</td>
                        <td>Desde fecha: ${dateStart}</td>
                        <td>Hasta fecha: ${dateEnd}</td>
                        
                    </tr>
                   
                    <tr>
                        <td>Considerando todos los conceptos</td>
                    </tr>
        `
    }

    async getHeadParcelas(table:string,type:string,ingenioName:string,dateStart:string,dateEnd:string,ingenioAddress:any){
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
                    <h1>${ingenioName}</h1>
                    <h1>${this.reportTypes[table]} ${this.reportParcelasType[type]}</h1>
            <div>
                <table class="border">
                    <tr>
                        <td colspan="3">Tipo de documento: ${this.reportTypes[table]}</td>
                        <td colspan="4">Direccion: ${ingenioAddress[0].calle},#${ingenioAddress[0].numero} ${ingenioAddress[0].ciudad}</td>
                    </tr>
                    <tr>
                        <td colspan="2">${type}: Todas</td>
                        <td colspan="2">Desde fecha: ${dateStart}</td>
                        <td colspan="3">Hasta fecha: ${dateEnd}</td>
                        
                    </tr>
                   
                    <tr>
                        <td colspan="7">Considerando todos los conceptos</td>
                        
                    </tr>
        `
    }

    getBody(data:any,type:string){
       let object:any = {};
       console.log("OBJECT",object);
       if(type=="producto"){
       for(let item of data){
           if(object[item.description]){
               if(object[item.description][item.orderid]){
                   
                       if(object[item.description][item.orderid].date<item.date){
                           object[item.description][item.orderid].date=item.date;
                           object[item.description][item.orderid].count+=item.count;
                       }else{
                            object[item.description][item.orderid].count+=item.count;
                       }
                   
                
               }else{
                   object[item.description][item.orderid]={
                       date: item.date,
                       count: 1
                   };
               }
           }else{
               object[item.description]={};
               object[item.description][item.orderid]={
                   date: item.date,
                   count: 1
               }
           }
       }
    }else{
        for(let item of data){
        if(object[item.orderid]){
            if(object[item.orderid][item.description]){
                
                    if(object[item.orderid][item.description].date<item.date){
                        object[item.orderid][item.description].date=item.date;
                        object[item.orderid][item.description].count+=item.count;;
                    }else{
                         object[item.orderid][item.description].count+=item.count;
                    }
                
             
            }else{
                object[item.orderid][item.description]={
                    date: item.date,
                    count: 1
                };
            }
        }else{
            object[item.orderid]={};
            object[item.orderid][item.description]={
                date: item.date,
                count: 1
            }
        }
    }
    }

       let keys = Object.keys(object);
       let body="";
       let totalBultos=0;
       for(let item of keys){
            body += `
            <tr class="border">
            <td>${(type=="producto")?"Producto:":"Orden:"} ${item}</td>
            <td></td>
            <td></td>
            </tr>
            <tr>
            <td>${(type!="producto")?"Producto":"Orden"}</td>
            <td>Fecha</td>
            <td>Cantidad</td>
            </tr>
            `;
        let keysSec = Object.keys(object[item]);
        console.log("KEYSECS",keysSec)
        let totalCount = 0;
        for(let itemsec of keysSec){
            body+=`
            <tr>
            <td>${itemsec}</td>
            <td>${object[item][itemsec]['date']}</td>
            <td>${object[item][itemsec]['count']}</td>
            </tr>
            `
            totalCount += object[item][itemsec]['count'];
        }
        body+=`
        <tr>
        <td></td><td style="text-align:right">SubTotal:</td><td class="border">${totalCount}</td>
        </tr>
        `;
        totalBultos+=totalCount;
       }

       body+=`
       <tr class="border">
       <td></td><td colspan="2">Total General:  ${totalBultos} Bultos</td>
       </tr>
       </table></body></html>
       `;
       return body;
    }

    async getBodyOnlyProducts(data:any){
        let object:any = {};
        for(let item of data){
        if(object[item.description]){
            if(object[item.description]){
                
                    if(object[item.description][item.date]){
                        object[item.description][item.date].count+=item.count;
                    }else{
                         object[item.description][item.date]={};
                         object[item.description][item.date].count=item.count;
                    }
                
             
            }else{
                object[item.description][item.date]={
                    count: item.count
                };
            }
        }else{
            object[item.description]={};
            object[item.description][item.date]={
                count: item.count
            }
        }
    }

    let keys = Object.keys(object);
       let body="";
       let totalBultos=0;
       for(let item of keys){
            body += `
            <tr class="border">
            <td>Producto: ${item}</td>
            <td></td>
            <td></td>
            </tr>
            <tr>
            <td colspan="2">Fecha</td>
            <td>Cantidad</td>
            </tr>
            `;
        let keysSec = Object.keys(object[item]);
        console.log("KEYSECS",keysSec)
        let totalCount = 0;
        for(let date of keysSec){
            body+=`
            <tr>
           
            <td colspan="2">${date}</td>
            <td>${object[item][date].count}</td>
            </tr>
            `
            totalCount += object[item][date].count;
        }
            body+=`
        <tr>
        <td></td><td style="text-align:right">SubTotal:</td><td class="border">${totalCount}</td>
        </tr>
        `;
        totalBultos+=totalCount;
    
        }


       body+=`
       <tr class="border">
       <td></td><td colspan="2">Total General:  ${totalBultos} Bultos</td>
       </tr>
       </table></body></html>
       `;
       return body;

    }
    
    async getBodyOnlyParcelasNotAplicated(data:any){
        let object:any = {};
        for(let item of data){
            if(object[item.formula]){
                if(object[item.formula][item.zona]){
                    if(object[item.formula][item.zona][item.ejido]){
                        object[item.formula][item.zona][item.ejido].push({
                            codigo: item.codigo,
                            productor: item.productor,
                            bultos: item.bultos,
                            date:item.date,
                            aplicated: item.aplicated
                        })
                    }else{
                        object[item.formula][item.zona][item.ejido]=[{
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }]
                    }
                }else{
                    object[item.formula][item.zona]={};
                    object[item.formula][item.zona][item.ejido]=[{
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }
                    ]
                }
            }else{
                object[item.formula]={};
                object[item.formula][item.zona]={};
                object[item.formula][item.zona][item.ejido]=[{
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }
                    ]
            }
        }

        let body ="";
        let formulas = Object.keys(object);
        let totalGlobal = 0;
        for(let formula of formulas){
            body += `
            <tr class="border">
            <td>Producto: ${formula}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            </tr>
            <tr>
            <td>Zona</td>
            <td>Ejido</td>
            <td>Parcela</td>
            <td>Fecha de ultima aplicación</td>
            <td>Productor</td>
            <td>bultos asignados </td>
            <td>bultos aplicados</td>
            </tr>
            `;
            let totalCountByFormule = 0;
            let zonas = Object.keys(object[formula]);
            
            for(let zona of zonas){
                let ejidos = Object.keys(object[formula][zona]);
                for(let ejido of ejidos){
                    for(let parcela of object[formula][zona][ejido]){
                        body+=`
                        <tr>
                        <td>${zona}</td>
                        <td>${ejido}</td>
                        <td>${parcela.codigo}</td>
                        <td>${parcela.date}</td>
                        <td>${parcela.productor}</td>
                        <td>${parcela.bultos}</td>
                        <td>${parcela.aplicated}</td>
                        </tr>
                        `;
                        totalCountByFormule +=(parcela.bultos-parcela.aplicated);
                    }
                }
            }
            body+=`
            <tr class="border">
            <td colspan="7" style="text-align: right">No aplicados:  ${totalCountByFormule} Bultos</td>
            </tr>
            </table></body></html>
            `;
            totalGlobal += totalCountByFormule;


        }
        body+=`
            <tr class="border">
            <td colspan="7" style="text-align: right">Total no aplicados:  ${totalGlobal} Bultos</td>
            </tr>
            </table></body></html>
            `;
        return body;
    }

    async getBodyOnlyParcelas(data:any,type:string){
        let body ="";
        if(type!="parcela"){
            if(type=="ejido"){
                let obj:any = {};
                for(let item of data){
                    if(obj[item.ejidolocalidad]){
                        if(obj[item.ejidolocalidad][item.zona]){
                            obj[item.ejidolocalidad][item.zona].push({
                                    codigo: item.codigo,
                                    bultos: item.bultos,
                                    formula: item.formula,
                                    date: item.date,
                                    productor: item.productor
                                  
                            });
                        }else{
                            obj[item.ejidolocalidad][item.zona]=[{
                                    codigo: item.codigo,
                                    bultos: item.bultos,
                                    formula: item.formula,
                                    date: item.date,
                                    productor: item.productor
                                
                            }]
                            
                        }
                    }else{
                        obj[item.ejidolocalidad]={
                            [item.zona]:[{
                                    codigo: item.codigo,
                                    bultos: item.bultos,
                                    formula: item.formula,
                                    date: item.date,
                                    productor: item.productor
                                }]
                            }
                        };
                    }
                    let keys = Object.keys(obj);
                    for(let ejido of keys){
                        body+=`
                        <tr>
                        <td colspan="7" class="border">
                        Ejido: ${ejido}
                        </td>
                        </tr><tr>
                        <td>Zona</td>
                        <td>Parcela</td>
                        <td>fecha</td> 
                        <td>Productor</td>
                        <td>Producto</td>
                        <td>US</td>
                        <td>Cantidad</td>
                        </tr>`;
                        let zonas = Object.keys(obj[ejido]);
                        for(let zona of zonas){

                            for(let item of obj[ejido][zona]){
                            body +=  `
                            <tr>
                            <td>${zona}</td><td>${item.codigo}</td><td>${item.date}</td><td>${item.productor}</td><td>${item.formula}</td><td>BULTOS</td><td>${item.bultos}</td>
                            </tr>
                            `
                            }
                        }
                       
                        
                        
                    }
            }else if(type=="zona"){
                let obj:any = {};
                for(let item of data){
                    if(obj[item.zona]){
                        if(obj[item.zona][item.ejidolocalidad]){
                            obj[item.zona][item.ejidolocalidad].push({
                                    codigo: item.codigo,
                                    bultos: item.bultos,
                                    formula: item.formula,
                                    date: item.date,
                                    productor: item.productor
                                  
                            });
                        }else{
                            obj[item.zona][item.ejidolocalidad]=[{
                                    codigo: item.codigo,
                                    bultos: item.bultos,
                                    formula: item.formula,
                                    date: item.date,
                                    productor: item.productor
                                
                            }]
                            
                        }
                    }else{
                        obj[item.zona]={
                            [item.ejidolocalidad]:[{
                                    codigo: item.codigo,
                                    bultos: item.bultos,
                                    formula: item.formula,
                                    date: item.date,
                                    productor: item.productor
                                }]
                            }
                        };
                    }
                    let keys = Object.keys(obj);
                    for(let zona of keys){
                        body+=`
                        <tr>
                        <td colspan="7" class="border">
                        Zona: ${zona}
                        </td>
                        </tr><tr>
                        <td>Ejido</td>
                        <td>Parcela</td>
                        <td>fecha</td> 
                        <td>Productor</td>
                        <td>Producto</td>
                        <td>US</td>
                        <td>Cantidad</td>
                        </tr>`;
                        let ejidos = Object.keys(obj[zona]);
                        console.log("EJIDOS",ejidos);
                        for(let ejido of ejidos){

                            for(let item of obj[zona][ejido]){
                            body +=  `
                            <tr>
                            <td>${ejido}</td><td>${item.codigo}</td><td>${item.date}</td><td>${item.productor}</td><td>${item.formula}</td><td>BULTOS</td><td>${item.bultos}</td>
                            </tr>
                            `
                            }
                        }
                       
                        
                        
                    }
            }
        }else{
        
     
        for(let item of data){
            body+=`
            <tr>
            <td colspan="7" class="border">
            Parcela: ${item.codigo}
            </td>
            </tr> 
            <tr>
            <td>Zona</td>
            <td>Ejido</td>
            <td>fecha</td> 
            <td>Productor</td>
            <td>Producto</td>
            <td>US</td>
            <td>Cantidad</td>
            </tr>
            <tr>
            <td>${item.zona}</td><td>${item.ejidolocalidad}</td><td>${item.date}</td><td>${item.productor}</td><td>${item.formula}</td><td>BULTOS</td><td>${item.bultos}</td>
            </tr>
            `
            
            
        }
    }
        return body;
    }

    async getBodyOnlyParcelasNotAplicatedByTypes(data:any,type:string){
        let object:any = {};

        for(let item of data){
            if(type=="ejido"){
            if(object[item.ejido]){
                if(object[item.ejido][item.zona]){
                    
                        object[item.ejido][item.zona].push({
                            formula: item.formula,
                            codigo: item.codigo,
                            productor: item.productor,
                            bultos: item.bultos,
                            date:item.date,
                            aplicated: item.aplicated
                        })
                   
                }else{
                    object[item.ejido][item.zona]=[{
                            formula:item.formula,
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }
                    ]
                }
            }else{
                object[item.ejido]={};
                object[item.ejido][item.zona]=[{
                            formula:item.formula,
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }
                    ]
            }
        }else if(type=="zona"){
            if(object[item.zona]){
                
                    if(object[item.zona][item.ejido]){
                        object[item.zona][item.ejido].push({
                            formula:item.formula,
                            codigo: item.codigo,
                            productor: item.productor,
                            bultos: item.bultos,
                            date:item.date,
                            aplicated: item.aplicated
                        })
                    
                }else{
                    object[item.zona][item.ejido]=[{
                            formula:item.formula,
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }
                    ]
                }
            }else{
                object[item.zona]={};
                object[item.zona][item.ejido]=[{
                            formula:item.formula,
                            codigo: item.codigo,
                            date: item.date,
                            productor: item.productor,
                            bultos: item.bultos,
                            aplicated: item.aplicated
                        }
                    ]
            }
        
        }
    }

        let body ="";
        if(type=="parcela"){
        let totalGlobal = 0;
        for(let parcela of data){
            
            body += `
            <tr class="border">
            <td>Parcela: ${parcela.codigo}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            </tr>
            <tr>
            <td>Zona</td>
            <td>Ejido</td>
            <td>Formula</td>
            <td>Fecha de ultima aplicación</td>
            <td>Productor</td>
            <td>bultos asignados </td>
            <td>bultos aplicados</td>
            </tr>
                        <tr>
                        <td>${parcela.zona}</td>
                        <td>${parcela.ejido}</td>
                        <td>${parcela.formula}</td>
                        <td>${parcela.date}</td>
                        <td>${parcela.productor}</td>
                        <td>${parcela.bultos}</td>
                        <td>${parcela.aplicated}</td>
                        </tr>
                        
            <tr class="border">
            <td colspan="7" style="text-align: right">No aplicados:  ${(parcela.bultos-parcela.aplicated)} Bultos</td>
            </tr>
            </table></body></html>
            `;
            totalGlobal += (parcela.bultos-parcela.aplicated);
                    }
            
                    body+=`
                    <tr class="border">
                    <td colspan="7" style="text-align: right">Total no aplicados:  ${totalGlobal} Bultos</td>
                    </tr>
                    </table></body></html>
                    `;
                }else if(type=="ejido"){
                    let totalGlobal = 0;
                    let ejidos = Object.keys(object);
                    for(let ejido of ejidos){
                        
                        body += `
                        <tr class="border">
                        <td>Ejidos: ${ejido}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>
                        <tr>
                        <td>Zona</td>
                        <td>Parcela</td>
                        <td>Formula</td>
                        <td>Fecha de ultima aplicación</td>
                        <td>Productor</td>
                        <td>bultos asignados </td>
                        <td>bultos aplicados</td>
                        </tr>`;
                        let zonas = Object.keys(object[ejido]);
                        let total = 0;
                        for(let zona of zonas){
                            
                            for(let item of object[ejido][zona]){
                                
                                    body+=`
                                                <tr>
                                                <td>${zona}</td>
                                                <td>${item.codigo}</td>
                                                <td>${item.formula}</td>
                                                <td>${item.date}</td>
                                                <td>${item.productor}</td>
                                                <td>${item.bultos}</td>
                                                <td>${item.aplicated}</td>
                                                </tr>
                                                
                                    <tr class="border">
                                    <td colspan="7" style="text-align: right">No aplicados:  ${(item.bultos-item.aplicated)} Bultos</td>
                                    </tr>
                                    </table></body></html>
                                    `;
                                    total += item.bultos-item.aplicated;
                            }
                        }
                        totalGlobal += total;
                                }
                        
                                body+=`
                                <tr class="border">
                                <td colspan="7" style="text-align: right">Total no aplicados:  ${totalGlobal} Bultos</td>
                                </tr>
                                </table></body></html>
                                `;


                }else if(type=="zona"){
                    let totalGlobal = 0;
                    let zonas = Object.keys(object);
                    console.log("ZONA",JSON.stringify(object));
                    for(let zona of zonas){
                        
                        body += `
                        <tr class="border">
                        <td>Zona: ${zona}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>
                        <tr>
                        <td>Ejido</td>
                        <td>Parcela</td>
                        <td>Formula</td>
                        <td>Fecha de ultima aplicación</td>
                        <td>Productor</td>
                        <td>bultos asignados </td>
                        <td>bultos aplicados</td>
                        </tr>`;
                        let ejidos = Object.keys(object[zona]);
                        let total = 0;
                        for(let ejido of ejidos){
                            
                            for(let item of object[zona][ejido]){
                                    body+=`
                                                <tr>
                                                <td>${ejido}</td>
                                                <td>${item.codigo}</td>
                                                <td>${item.formula}</td>
                                                <td>${item.date}</td>
                                                <td>${item.productor}</td>
                                                <td>${item.bultos}</td>
                                                <td>${item.aplicated}</td>
                                                </tr>
                                                
                                    <tr class="border">
                                    <td colspan="7" style="text-align: right">No aplicados:  ${(item.bultos-item.aplicated)} Bultos</td>
                                    </tr>
                                    </table></body></html>
                                    `;
                                    total += item.bultos-item.aplicated;
                            }
                        }
                        totalGlobal += total;
                                }
                        
                                body+=`
                                <tr class="border">
                                <td colspan="7" style="text-align: right">Total no aplicados:  ${totalGlobal} Bultos</td>
                                </tr>
                                </table></body></html>
                                `;


                }
            


        
        
        return body;
    }
}