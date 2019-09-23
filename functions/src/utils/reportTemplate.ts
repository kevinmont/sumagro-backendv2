import * as log4js from 'log4js';

const logger = log4js.getLogger('ReportTemplate');
logger.level='info';
export class ReportTemplate{
    
    
    reportTypes:any={
        entrance: "REPORTE DE ENTRADAS",
        aplicated: "REPORTE DE APLICADOS",
        outputs: "REPORTE DE SALIDAS",
        intransit: "REPORTE EN TRANSITO",
        inventory: "REPORTE DE INVENTARIO",
        sumagrooutputs: "REPORTE DE SALIDAS DE ALMACEN",
        sumagrointransit: "REPORTE EN TRANSITO DE ALMACEN "
    };

    reportClases:any = {
        producto: "POR PRODUCTO",
        orden: "POR ORDEN"
    }

    reportParcelasType:any={
        producto: "POR PRODUCTO",
        ejido: "POR EJIDO",
        zona:"POR ZONA",
        parcela: "POR PARCELA",
        cliente: "POR CLIENTE",
        outofparcel: "FUERA DE PARCELA"
    }
    async getReport(table:string,type:string,dateStart:string,dateEnd:string,data:any,ingenioName:any,subType?:string){
        console.log("INGENIO NAME2: ",ingenioName);
        let response = "";
        let head:any="";
        let body ="";
        switch(table){
            case 'entrance':
                if(type=="orden" || type=="producto"){
                    head= await this.getHead(table,type,ingenioName,dateStart,dateEnd,"");
                    body = await this.getBody(data,type);   
                    response= head+body;
                }else{
                    response="<html><body>NO EXISTE ESE TIPO DE REPORTE</body></html>"
                }
                break;
            case 'outputs': 
                    if(type=="producto"){
                        head= await this.getHead(table,type,ingenioName,dateStart,dateEnd,"");
                    body = await this.getBodyByProduct(data);   
                    response= head+body;
                    }else{
                        response="<html><body>NO EXISTE ESE TIPO DE REPORTE</body></html>"
                    }
            break;
            case 'intransit':
                    if(type=="orden" || type=="producto"){
                        head= await this.getHead(table,type,ingenioName,dateStart,dateEnd,"");
                        body = await this.getBody(data,type);   
                        response= head+body;
                    }else{
                        response="<html><body>NO EXISTE ESE TIPO DE REPORTE</body></html>"
                    }
                break;
            case 'inventory':
                    if(type=="producto"){
                        head= await this.getHead(table,type,ingenioName,dateStart,dateEnd,"");
                    body = await this.getBodyByProduct(data);   
                    response= head+body;
                    }else{
                        response="<html><body>NO EXISTE ESE TIPO DE REPORTE</body></html>"
                    }
                break;
            case 'aplicated':
                    if(type=="producto" || type=="ejido" || type=="parcela" || type=="zona"){
                        head= await this.getHead(table,type,ingenioName,dateStart,dateEnd,subType);
                        
                    body = await this.getBodyOfAplicatedTypes(data,type,subType);   
                    response= head+body;
                    }else if(type=="outofparcel"){
                        head= await this.getHead(table,type,ingenioName,dateStart,dateEnd,subType);
                        
                    body = await this.getBodyOfAplicatedTypes(data,type,subType);   
                    response= head+body;
                    }
                
                break;
            case 'sumagrointransit':
            case 'sumagrooutputs':
                    if(type=="producto"){
                        head= await this.getHead(table,type,"ALMACEN",dateStart,dateEnd,"");
                        body = await this.getBody(data,type);
                    }else if(type=="cliente"){
                        head= await this.getHead(table,type,"ALMACEN",dateStart,dateEnd,"");
                        body = await this.getBody(data,type);
                    }else if(type=="orden"){
                        head= await this.getHead(table,type,"ALMACEN",dateStart,dateEnd,"");
                        body = await this.getBody(data,type);
                    }
                    response= head+body;
                break; 
            default:
               response = '<html><body>NO EXISTE ESA ENTIDAD</body></html>'
                break;
        }
        return response;
    }

    async getHead(table:string,type:string,ingenioName:string,dateStart:string,dateEnd:string,subType?:string){
        let dateS = new Date(dateStart);
        let dateE= new Date(dateEnd);
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            </head>
                <style>
                    div.container{
                        text-align: center;
                    }
                    .titulo{
                        vertical-align: middle;
                        font-family: Arial;
                        font-size: 26px;
                    }
                    
                    .subtitulotipo{
                        text-align: center;
                        font-family: Arial;
                        font-size: 18px;
                    }
                    .table{
                        width: 90%;
                    }
                    .items{
                        font-family: Arial;
                        font-size: 16px;
                    }
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
            <div class="container">
            ${(table=="sumagrooutputs" || table=="sumagrointransit")?`
            <label class="titulo">FERTILIZANTES SUMAGRO</label><br>
                <label class="titulo">S.A. DE C.V.<label></div>
            <p class="subtitulotipo"><strong>${ingenioName}</strong></p>
            `:`
            <label class="titulo">NOMBRE DEL CLIENTE</label><br>
                <label class="titulo">${ingenioName}<label></div>
            `}
                    <p class="subtitulotipo">${this.reportTypes[table]} ${(Object.keys(this.reportClases).includes(type))?this.reportClases[type]:this.reportParcelasType[type]}</p>
            <div>
                <table class="table">
                    <tr>
                    ${(subType=="notaplicated" || subType=="aplicated")?`
                    <td colspan="${(subType=="notaplicated")?"2":"3"}" style="text-align:left"><label class="items" >${type.charAt(0).toUpperCase()+type.slice(1,type.length)}: TODOS</label></td>
                        <td colspan="2"><label class="items">Desde: ${dateS.getDate()}/${dateS.getMonth()+1}/${dateS.getFullYear()}</label></td>
                        <td colspan="2"><label class="items">Hasta: ${dateE.getDate()}/${dateE.getMonth()+1}/${dateE.getFullYear()}</label></td>
                    `:`
                    <td colspan="${(type=="cliente")?"1":"2"}" style="text-align:left"><label class="items" >${type.charAt(0).toUpperCase()+type.slice(1,type.length)}: TODOS</label></td>
                        <td colspan="${(type=="cliente")?"2":"1"}"><label class="items">Desde: ${dateS.getDate()}/${dateS.getMonth()+1}/${dateS.getFullYear()}</label></td>
                        <td colspan="${(type=="cliente")?"2":"1"}"><label class="items">Hasta: ${dateE.getDate()}/${dateE.getMonth()+1}/${dateE.getFullYear()}</label></td>
                    `}
                        
                    </tr> `
    }
//----------------------------------------------------------------------------------------->
    getBody(data:any,type:string){
       let object:any = {};
       console.log("OBJECT",object,data);
       if(type=="producto"){
       for(let item of data){
           if(object[item.description]){
              if(object[item.description][item.orderid]){
                    object[item.description][item.orderid].count +=1;
                    if(object[item.description][item.orderid].date<item.date){
                        object[item.description][item.orderid].date = item.date;
                    }
              }else{ 
                 object[item.description][item.orderid] = {
                     remissionNumber: item.remissionnumber,
                     ingenioName: item.name,
                     count: 1,
                     date:item.date
                 }; 
              }
           }else{
              object[item.description] = {};
              object[item.description][item.orderid]= {
                  remissionNumber: item.remissionnumber,
                  ingenioName:item.name,
                  count: 1,
                  date: item.date
              };
           }
       }
    }else if(type=="orden"){
        for(let item of data){
        if(object[item.orderid]){
            if(object[item.orderid]['productos'][item.description]){
                if(object[item.orderid]['productos'][item.description].date<item.date){
                    object[item.orderid]['productos'][item.description].date = item.date
                }
                object[item.orderid]['productos'][item.description].count +=1;
            }else{
                object[item.orderid]['productos'][item.description] = {
                    date: item.date,
                    count: 1
                }
            }
        }else{
            object[item.orderid] = {
                remissionNumber: item.remissionnumber,
                ingenioName: item.name
            }    
            object[item.orderid]['productos'] = {};
            object[item.orderid]['productos'][item.description] = {
                date: item.date,
                count: 1
            }
        }
    }
    }else if(type=="cliente"){
            for(let item of data){
                if(object[item.name]){
                    if(object[item.name][item.orderid]){
                        if(object[item.name][item.orderid][item.description]){
                            if(object[item.name][item.orderid][item.description].date<item.date){
                                object[item.name][item.orderid][item.description].date = item.date;
                            }
                            object[item.name][item.orderid][item.description].count +=1;
                        }else{
                            object[item.name][item.orderid][item.description]= {
                                date: item.date,
                                count: 1
                            }
                        }
                    }else{
                        object[item.name][item.orderid] = {
                            remissionNumber: item.remissionnumber
                        };
                        object[item.name][item.orderid]['productos'] ={};
                        object[item.name][item.orderid]['productos'][item.description]= {
                            date: item.date,
                            count: 1
                        }
                    }
                }else{
                    object[item.name]= {}
                    object[item.name][item.orderid]={
                        remissionNumber: item.remissionnumber
                    };
                    object[item.name][item.orderid]['productos']={};
                    object[item.name][item.orderid]['productos'][item.description] = {
                        date: item.date,
                        count: 1
                    }
                }
            }
    }
       let keys = Object.keys(object);
       let body="";
       if(type=="cliente" && keys.length){
        let totalGeneral = 0;
        for(let item of keys){
            let totalByOrder = 0;
        body+=`
             <tr class="border">
                 <td colspan="4" style="text-align:left"><label class="items">${type.charAt(0).toUpperCase()+type.slice(1,type.length)}: ${item}</label></td>
                 
             </tr>
             <tr class="border">
             <td><label class="items">Orden</label></td><td><label class="items">Producto</label></td><td><label class="items">Fecha</label></td><td><label class="items">Unidad</label></td><td><label class="items">Cantidad</label></td>
             </tr>
             <tr>
             `;
             let ordenes = Object.keys(object[item]);
             for(let orden of ordenes){
                 let formulas = Object.keys(object[item][orden]['productos']);
                 for(let formula of formulas){
                 let dateToParse=new Date(object[item][orden]['productos'][formula].date);
                 body +=`
                 <td><label class="items">${object[item][orden].remissionNumber}</label></td>
                 <td><label class="items">${formula}</label></td>
                 <td><label class="items">${dateToParse.getDate()}/${dateToParse.getMonth()+1}/${dateToParse.getFullYear()} ${dateToParse.getHours()}:${dateToParse.getMinutes()}</label></td>
                 <td><label class="items">Bultos</label></td>
                 <td><label class="items">${object[item][orden]['productos'][formula].count}</label></td>
                 `;
                 totalByOrder+=object[item][orden]['productos'][formula].count;
                 totalGeneral+=totalByOrder;
                 }
             }
             body+=`
             </tr>
             <tr >
             <td colspan="3"></td>
             <td  style="text-align:center"><label class="items">Sub-total</label></td>
             <td class="border"><label class="items">${totalByOrder}</label></td>
             </tr>
             `;
         }
         body+=`
         <tr class="border">
             <td colspan="4" style="text-align:right"><label class="items">Total general</label></td>
             <td><label class="items">${totalGeneral}</label></td>
             </tr>
             </table></body></html>
         `;
       }else if(type=="orden" && keys.length){
        let totalGeneral = 0;
        for(let item of keys){
            let totalByProduct = 0;
        body+=`
             <tr class="border">
                 <td colspan="2" style="text-align:left"><label class="items">${type.charAt(0).toUpperCase()+type.slice(1,type.length)}: ${object[item].remissionNumber}</label></td>
                 <td colspan="2" style="text-align:left"><label class="items">Cliente: ${object[item].ingenioName}</label></td>
             </tr>
             <tr class="border">
             <td><label class="items">Producto</label></td><td><label class="items">Fecha</label></td><td><label class="items">Unidad</label></td><td><label class="items">Cantidad</label></td>
             </tr>
             <tr>
             `;
             let productos = Object.keys(object[item]['productos']);
             for(let producto of productos){
                 let dateToParse=new Date(object[item]['productos'][producto].date);
                 body +=`
                 <td><label class="items">${producto}</label></td>
                 <td><label class="items">${dateToParse.getDate()}/${dateToParse.getMonth()+1}/${dateToParse.getFullYear()} ${dateToParse.getHours()}:${dateToParse.getMinutes()}</label></td>
                 <td><label class="items">Bultos</label></td>
                 <td><label class="items">${object[item]['productos'][producto].count}</label></td>
                 `;
                 totalByProduct+=object[item]['productos'][producto].count;
                 totalGeneral+=totalByProduct;
             }
             body+=`
             </tr>
             <tr >
             <td colspan="2"></td>
             <td  style="text-align:center"><label class="items">Sub-total</label></td>
             <td class="border"><label class="items">${totalByProduct}</label></td>
             </tr>
             `;
         }
         body+=`
         <tr class="border">
             <td colspan="3" style="text-align:right"><label class="items">Total general</label></td>
             <td><label class="items">${totalGeneral}</label></td>
             </tr>
             </table></body></html>
         `;
       }else if(type=="producto" && keys.length){
           let totalGeneral = 0;
           for(let item of keys){
               let totalByOrder = 0;
           body+=`
                <tr class="border">
                    <td colspan="4" style="text-align:left"><label class="items">${type.charAt(0).toUpperCase()+type.slice(1,type.length)}: ${item}</label></td>
                </tr>
                <tr class="border">
                <td><label class="items">Orden</label></td><td><label class="items">Cliente</label></td><td><label class="items">Unidad</label></td><td><label class="items">Cantidad</label></td>
                </tr>
                <tr>
                `;
                let ordenes = Object.keys(object[item]);
                for(let orden of ordenes){
                    body +=`
                    <td><label class="items">${object[item][orden].remissionNumber}</label></td>
                    <td><label class="items">${object[item][orden].ingenioName}</label></td>
                    <td><label class="items">Bultos</label></td>
                    <td><label class="items">${object[item][orden].count}</label></td>
                    `;
                    totalByOrder+=object[item][orden].count;
                    totalGeneral+=totalByOrder;
                }
                body+=`
                </tr>
                <tr >
                <td colspan="2"></td>
                <td  style="text-align:center"><label class="items">Sub-total</label></td>
                <td class="border"><label class="items">${totalByOrder}</label></td>
                </tr>
                `;
            }
            body+=`
            <tr class="border">
                <td colspan="3" style="text-align:right"><label class="items">Total general</label></td>
                <td><label class="items">${totalGeneral}</label></td>
                </tr>
                </table></body></html>
            `;
       }else{
           body=`</table></body></html>`;
       }
              return body;
    }
    //----------------------------------------------------------------------------------------->
    async getBodyByProduct(data:any){
        let body="";
        let object:any={};
        for(let item of data){
            if(object[item.description]){
                object[item.description].push({
                    date: item.dateFormat,
                    count: item.count
                });
            }else{
                object[item.description]=[
                    {
                        date: item.dateFormat,
                        count: item.count
                    }
                ]
            }
        }
        let formulas = Object.keys(object);
        let totalGeneral=0;
        for(let formula of formulas){
            body+=`
            <tr class="border">
            <td colspan="4" style="text-align:left;">Producto: ${formula}</td>
            </tr>
            <tr>
            <td></td>
                <td  style="text-align:center;">Fecha</td>
                <td>Unidad</td>
                <td>Cantidad</td>
            </tr>
            `;
            let totalByFormula = 0;
            for(let rowFomula of object[formula]){
                body+=`
                <tr>
                <td></td>
                <td style="text-align:center;">${rowFomula.date}</td>
                <td>BULTOS</td>
                <td>${rowFomula.count}</td>
                </tr>
                `;
                totalByFormula+=rowFomula.count;
            }
            totalGeneral+=totalByFormula;   
            body+=`<tr>
            <td colspan="2"></td>
            <td style="text-align:center;">Sub-total:</td>
            <td class="border">${totalByFormula}</td>
            </tr>`
        }
        body+=`
        <tr class="border">
        <td colspan="2"></td>
            <td style="text-align:center;">Total general:</td>
            <td class="border">${totalGeneral}</td>
        </tr></table></body></html>
        `;
        return body;
    }

    async getBodyOfAplicatedTypes(data:[any],type:string,subType?:string){
        let object:any={};
        if(type=="producto"){
            for(let item of data){
                if(object[item.producto]){
                    if(object[item.producto][item.zona]){
                        if(object[item.producto][item.zona][item.ejido]){
                            if(object[item.producto][item.zona][item.ejido][item.productor]){
                                object[item.producto][item.zona][item.ejido][item.productor].push({
                                    parcela: item.parcela,
                                    date: item.date,
                                    cantidad: item.cantidad
                                });
                            }else{
                                object[item.producto][item.zona][item.ejido][item.productor] = [
                                    {
                                        parcela: item.parcela,
                                        date: item.date,
                                        cantidad: item.cantidad
                                    }
                                ]    
                            }
                        }else{
                            object[item.producto][item.zona][item.ejido]={};
                            object[item.producto][item.zona][item.ejido][item.productor] = [
                                {
                                    parcela: item.parcela,
                                    date: item.date,
                                    cantidad: item.cantidad
                                }
                            ]    
                        }
                    }else{
                        object[item.producto][item.zona]={};
                        object[item.producto][item.zona][item.ejido]={};
                        object[item.producto][item.zona][item.ejido][item.productor] = [
                            {
                                parcela: item.parcela,
                                date: item.date,
                                cantidad: item.cantidad
                            }
                        ]    
                    }
                }else{
                    object[item.producto]={};
                    object[item.producto][item.zona]={};
                    object[item.producto][item.zona][item.ejido]={};
                    object[item.producto][item.zona][item.ejido][item.productor] = [
                        {
                            parcela: item.parcela,
                            date: item.date,
                            cantidad: item.cantidad
                        }
                    ]
                }
            }
        }else if(type=="zona"){
            for(let item of data){
                if(object[item.zona]){
                    if(object[item.zona][item.ejido]){
                        if(object[item.zona][item.ejido][item.productor]){
                            object[item.zona][item.ejido][item.productor].push({
                                parcela: item.parcela,
                                producto: item.producto,
                                date: item.date,
                                cantidad: item.cantidad
                            });
                        }else{
                            object[item.zona][item.ejido][item.productor]=[
                                {
                                parcela: item.parcela,
                                producto: item.producto,
                                date: item.date,
                                cantidad: item.cantidad
                                }
                            ];
                        }
                    }else{
                            object[item.zona][item.ejido]={};
                            object[item.zona][item.ejido][item.productor]=[
                                {
                                parcela: item.parcela,
                                producto: item.producto,
                                date: item.date,
                                cantidad: item.cantidad
                                }
                            ];
                    }
                }else{
                        object[item.zona]={};
                        object[item.zona][item.ejido]={};
                            object[item.zona][item.ejido][item.productor]=[
                                {
                                parcela: item.parcela,
                                producto: item.producto,
                                date: item.date,
                                cantidad: item.cantidad
                                }
                            ];
                }
            }
        }else if(type=="ejido"){
            for(let item of data){
                if(object[item.ejido]){
                    if(object[item.ejido][item.zona]){
                        if(object[item.ejido][item.zona][item.productor]){
                            object[item.ejido][item.zona][item.productor].push({
                                parcela: item.parcela,
                                producto: item.producto,
                                date: item.date,
                                cantidad: item.cantidad
                            })
                        }else{
                            object[item.ejido][item.zona][item.productor]=[{
                                parcela: item.parcela,
                                producto: item.producto,
                                date: item.date,
                                cantidad: item.cantidad
                            }]
                        }
                    }else{
                        object[item.ejido][item.zona]={}
                        object[item.ejido][item.zona][item.productor]=[{
                            parcela: item.parcela,
                            producto: item.producto,
                            date: item.date,
                            cantidad: item.cantidad
                        }]
                    }
                }else{
                    object[item.ejido]={};
                    object[item.ejido][item.zona]={};
                    object[item.ejido][item.zona][item.productor]=[{
                        parcela: item.parcela,
                        producto: item.producto,
                        date: item.date,
                        cantidad: item.cantidad
                    }];
                }
            }
        }
        let body="";
        if(type=="parcela"){
            for(let parcela of data){
                let currentDate =new Date(parcela.date);
                body+=`
                <tr class="border">
                <td colspan="${(subType=="notaplicated")?6:7}" style="text-align:left;"><label class="item">Parcela: ${parcela.parcela}</label></td>
                </tr>
                <tr class="border">
                <td>Zona</td>
                <td>Ejido</td>
                <td>Productor</td>
                <td>Producto</td>
                ${(subType!="notaplicated")?"<td>Fecha</td>":""}
                <td>Unidad</td>
                <td>Cantidad</td>
                </tr>
                <tr>
                <td>${parcela.zona}</td>
                <td>${parcela.ejido}</td>
                <td>${parcela.productor}</td>
                <td>${parcela.producto}</td>
                ${(subType!="notaplicated")? "<td>"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()+"</td>":""};
                <td>BULTOS</td>
                <td>${parcela.cantidad}</td>
                </tr>
                `;
            }
            body+=`
            </table></body></html>
            `;
        }else if(type=="zona"){
            let zonas = Object.keys(object);
            let totalGeneral=0;
            for(let zona of zonas){
                let ejidos = Object.keys(object[zona]);
                body+=`
                            <tr class="border">
                            <td colspan="${(subType=="notaplicated")?6:7}" style="text-align:left;"><label class="items">Zona: ${zona}</label></td>
                            </tr>
                            <tr>
                            <td>Ejido</td>
                            <td>Productor</td>
                            <td>Parcela</td>
                            <td>Producto</td>
                            ${(subType!="notaplicated")?"<td>Fecha</td>":""}
                            <td>Unidad</td>
                            <td>Cantidad</td>
                            </tr>
                            `;
                for(let ejido of ejidos){
                    let productores = Object.keys(object[zona][ejido]);
                    for(let productor of productores){
                        let parcelas = object[zona][ejido][productor];
                            let subTotal=0;
                        for(let parcela of parcelas){
                            let currentDate =new Date(parcela.date);
                            body+=`
                            <tr>
                            <td>${ejido}</td>
                            <td>${productor}</td>
                            <td>${parcela.parcela}</td>
                            <td>${parcela.producto}</td>
                            ${(subType!="notaplicated")? "<td>"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()+"</td>":""};
                            <td>BULTOS</td>
                            <td>${parcela.cantidad}</td>
                            </tr>
                            `;
                            subTotal+=+parcela.cantidad;
                        }
                        totalGeneral+=subTotal;
                            body+=`
                            <tr class="border">
                            <td colspan="${(subType=="notaplicated")?5:6}" style="text-align:right;">Sub-total: </td><td>${subTotal}</td>
                            </tr>
                            `;
                    }
                }
            }
                    body+=`
                            <tr class="border">
                            <td colspan="${(subType=="notaplicated")?5:6}" style="text-align:right;">Total general: </td><td>${totalGeneral}</td>
                            </tr>
                            `;
        }else if(type=="producto"){
                let totalGeneral=0;
                let productos = Object.keys(object);
                for(let producto of productos){
                    let zonas = Object.keys(object[producto]);
                    let subTotal=0;
                    for(let zona of zonas){
                        let ejidos = Object.keys(object[producto][zona]);
                        body+=`
                                    <tr class="border">
                                    <td colspan="${(subType=="aplicated")?6:7}" style="text-align:left;"><label class="items">Producto: ${producto}</label></td>
                                    </tr>
                                    <tr class="border">
                                    <td>Zona</td>
                                    <td>Ejido</td>
                                    <td>Productor</td>
                                    <td>Parcela</td>
                                    ${(subType!="notaplicated")?"<td>Fecha</td>":""}
                                    <td>Unidad</td>
                                    <td>Cantidad</td>
                                    </tr>
                                    `;
                        for(let ejido of ejidos){
                            let productores = Object.keys(object[producto][zona][ejido]);
                            for(let productor of productores){
                                for(let parcela of object[producto][zona][ejido][productor]){
                                    let currentDate= new Date(parcela.date);
                                    body+=`
                                    <tr>
                                    <td>${zona}</td>
                                    <td>${ejido}</td>
                                    <td>${productor}</td>
                                    <td>${parcela.parcela}</td>
                                    ${(subType!="notaplicated")? "<td>"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()+"</td>":""};
                                    <td>BULTOS</td>
                                    <td>${parcela.cantidad}</td>
                                    </tr>
                                    `;
                                    subTotal+=+parcela.cantidad;
                                }
                            }
                        }
                        body+=`
                        <tr>
                        <td colspan="${(subType=="notaplicated")?5:6}" style="text-align:right">Sub-Total</td>
                        <td class="border">${subTotal}</td>
                        </tr>
                        `;
                    }
                    totalGeneral+=subTotal;
                }
                
                body+=`
                        <tr class="border">
                        <td colspan="${(subType=="notaplicated")?5:6}" style="text-align:right">Total general</td>
                        <td>${totalGeneral}</td>
                        </tr>
                        `;

                console.log("BODY",JSON.stringify(object));
        }else if(type=="ejido"){
            let ejidos = Object.keys(object);
            let totalGeneral=0;
            for(let ejido of ejidos){
                let zonas = Object.keys(object[ejido]);
                body+=`
                            <tr class="border"><td colspan="${(subType=="aplicated")?6:7}" style="text-align: left;"><label class="items">Ejido: ${ejido}</label></td></tr>
                            <tr class="border">
                            <td>Zona</td>
                            <td>Productor</td>
                            <td>Parcela</td>
                            <td>Producto</td>
                            ${(subType!="notaplicated")?"<td>Fecha</td>":""}
                            <td>Unidad</td>
                            <td>Cantidad</td>
                            </tr>
                            `;
                            let subTotal = 0;        
                for(let zona of zonas){
                    let productores = Object.keys(object[ejido][zona]);
                    for(let productor of productores){
                        let parcelas = object[ejido][zona][productor];
                        
                        for(let parcela of parcelas){
                            let currentDate= new Date(parcela.date);
                            body+=`
                            <tr>
                            <td>${zona}</td>
                            <td>${productor}</td>
                            <td>${parcela.parcela}</td>
                            <td>${parcela.producto}</td>
                            ${(subType!="notaplicated")? "<td>"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()+"</td>":""};
                            <td>BULTOS</td>
                            <td>${parcela.cantidad}</td>
                            </tr>
                            `;
                            subTotal+=+parcela.cantidad;
                        }
                    }
                }
                totalGeneral+=subTotal;
                body+=`
                <tr class="border">
                <td colspan="${(subType=="notaplicated")?5:6}" style="text-align:right;">Sub-total: </td><td class="boder">${subTotal}</td>
                </tr>
                `;
            }
            body+=`
                <tr class="border">
                <td colspan="${(subType=="notaplicated")?5:6}" style="text-align:right;">Total general: </td><td>${totalGeneral}</td>
                </tr>
                `;
        }
        if(type=="outofparcel"){
            let productores = Object.keys(object);
            let totalGeneral=0;
            for(let productor of productores){
                let subTotal=0;
                body+=`
                <tr class="border">
                <td colspan="7" style="text-align:left">Productor: ${productor}</td>
                </tr>
                <tr class="border">
                <td colspan="2">Codigo</td>
                <td>Zona</td>
                <td>Ejido</td>
                <td>Formula</td>
                <td>Cantidad</td>
                <td>Fecha</td>
                </tr>
                `;
                let parcelasOfProductor = object[productor].parcelas;
                let parcelasRows = [];
                for(let parcela of parcelasOfProductor){
                    parcelasRows.push(`<td>${parcela.codigo}</td><td>${parcela.zona}</td><td>${parcela.ejido}</td>`);
                }
                let productos = [];
                for(let producto of object[productor]){
                    if(producto!='parcelas'){
                        productos.push(`<td>${producto.description}</td><td>${producto.count}</td><td>${producto.date}</td>`);
                    }
                }
                if(productos.length>parcelasRows.length){
                    for(let i=0;i<productos.length;i++){
                        if(i<parcelasRows.length){
                            body+=parcelasRows[i];
                            
                        }else{
                            body+=`<td></td><td></td><td></td>`;
                        }
                        body+=productos[i];
                        subTotal+=1;
                    }
                }else{
                    for(let i=0;i<parcelasRows.length;i++){
                        body+=parcelasRows[i];
                        if(i<productos.length){
                            body+=productos[i];
                            subTotal+=1;
                            }else{
                            body+=`<td></td><td></td><td></td>`;
                            }
                        }
                }
                totalGeneral+=subTotal;
                body+=`<tr><td colspan="4" style="text-align:right">Subtotal: </td><td>${subTotal}</td><td></td></tr>`;
            }

            body+=`<tr class="border">
            <td colspan="4" style="text-align:right">Total: </td><td>${totalGeneral}</td><td></td>
            </tr></table></body></html>`;
        }
        return body;
    }
    
}