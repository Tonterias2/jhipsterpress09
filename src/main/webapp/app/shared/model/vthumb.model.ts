import { Moment } from 'moment';

export interface IVthumb {
    id?: number;
    creationDate?: Moment;
    vthumbup?: boolean;
    vthumbdown?: boolean;
    userId?: number;
    vquestionId?: number;
    vanswerId?: number;
}

export class Vthumb implements IVthumb {
    constructor(
        public id?: number,
        public creationDate?: Moment,
        public vthumbup?: boolean,
        public vthumbdown?: boolean,
        public userId?: number,
        public vquestionId?: number,
        public vanswerId?: number
    ) {
        this.vthumbup = this.vthumbup || false;
        this.vthumbdown = this.vthumbdown || false;
    }
}
