
export class TableModel{

    Id!:number;
    SoTT!:number;
    Task!:string;
    Status!:string;
    Datebegin!:Date;
    DateEnd!:Date;
    Note!:string;
    isEdit!:boolean;
    ishighlight!:boolean;
    constructor() {
      this.SoTT = this.getRandomInt();
      this.Task = '';
      this.Status = '';
      this.Note = '';
    }

    getRandomInt() {
      return Math.floor(Math.random() * 100);
    }
}
