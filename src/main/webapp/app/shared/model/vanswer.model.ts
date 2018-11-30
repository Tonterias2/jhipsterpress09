import { Moment } from 'moment';
import { IVthumb } from 'app/shared/model//vthumb.model';

export interface IVanswer {
    id?: number;
    creationDate?: Moment;
    urlvanser?: string;
    accepted?: boolean;
    vthumbs?: IVthumb[];
    userId?: number;
    vquestionId?: number;
}

export class Vanswer implements IVanswer {
    constructor(
        public id?: number,
        public creationDate?: Moment,
        public urlvanser?: string,
        public accepted?: boolean,
        public vthumbs?: IVthumb[],
        public userId?: number,
        public vquestionId?: number
    ) {
        this.accepted = this.accepted || false;
    }
}
