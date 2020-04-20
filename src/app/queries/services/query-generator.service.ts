import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { saveAs } from 'file-saver';

import { Server } from '@andes/shared';

import { environment } from 'src/environments/environment';
import { Options } from '@andes/shared/src/lib/server/options';
import { Plex } from '@andes/plex';

import * as moment from 'moment';
import { IFiltroQuery } from '../interfaces/IFiltroQuery.interface';


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
        const options: any = { headers: header, responseType: 'blob' };
        const res = this.server.get(`${this.biUrl}/queries`, options);
        return res;
    }

    descargar(consulta: IFiltroQuery, params) {
        const nombre = consulta.nombre || 'consulta';
        const header: any = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: window.sessionStorage.getItem('jwt') ? 'JWT ' + window.sessionStorage.getItem('jwt') : null
        });

        const options: any = { headers: header, responseType: 'blob', params };
        return this.http.get(`${environment.API}/bi/queries/${nombre}/csv`, options);

    }
}
