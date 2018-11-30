import { Moment } from 'moment';
import { IVquestion } from 'app/shared/model//vquestion.model';

export interface IVtopic {
    id?: number;
    creationDate?: Moment;
    vtopictitle?: string;
    vtopicdesc?: string;
    vquestions?: IVquestion[];
    userId?: number;
}

export class Vtopic implements IVtopic {
    constructor(
        public id?: number,
        public creationDate?: Moment,
        public vtopictitle?: string,
        public vtopicdesc?: string,
        public vquestions?: IVquestion[],
        public userId?: number
    ) {}
}
