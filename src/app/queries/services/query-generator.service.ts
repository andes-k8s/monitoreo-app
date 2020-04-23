import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { saveAs } from 'file-saver';

import { Server } from '@andes/shared';

import { Options } from '@andes/shared/src/lib/server/options';
import { Plex } from '@andes/plex';

import * as moment from 'moment';
import { IFiltroQuery } from '../interfaces/IFiltroQuery.interface';
import { environment } from '../../../environments/environment';


// Constantes
const defaultOptions: Options = { params: null, showError: true, showLoader: true };

@Injectable()
export class QueriesGeneratorService {

    private biUrl: string;

    constructor(private http: HttpClient, private server: Server, private plex: Plex) {
        this.biUrl = `${environment.API}/bi`;
    }

    // obtiene todas las queries
    getAllQueries(): Observable<any> {
        const header = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: window.sessionStorage.getItem('jwt') ? 'JWT ' + window.sessionStorage.getItem('jwt') : null
        });
        const options: any = { headers: header };
        const res = this.server.get(`${this.biUrl}/queries`, options);
        return res;
    }

    descargar(consulta: IFiltroQuery, params) {
        params = {
            desde: '2019-01-31',
            hasta: '2020-03-30'
        }
        // params = {
        //     desde: moment(new Date()).startOf('d').format(),
        //     hasta: moment(new Date()).endOf('d').format(),
        // };
        const nombre = consulta.nombre || 'consulta';
      
        const header = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: window.sessionStorage.getItem('jwt') ? 'JWT ' + window.sessionStorage.getItem('jwt') : null
        });

        
        const options: any = { params };
        return this.server.get(`${environment.API}/bi/queries/${nombre}/csv`, options);
    }
}
