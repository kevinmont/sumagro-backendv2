export default class TimeHelper{
    getRangeDate(from:string,to:string): string[]{
        let fechaInicio = new Date(from);
        let fechaFin    = new Date(to);
        let times = [];
        while(fechaFin.getTime() >= fechaInicio.getTime()){
            fechaInicio.setDate(fechaInicio.getDate() + 1);

            times.push(fechaInicio.getFullYear() + '/' + (fechaInicio.getMonth() + 1) + '/' + fechaInicio.getDate());
        }
        return times;
    }
}