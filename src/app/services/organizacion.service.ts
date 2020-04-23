import { Server, Cache } from '@andes/shared';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizacionService {
    private organizacionUrl = '/core/tm/organizaciones';  // URL to web api
    constructor(public server: Server) { }

    @Cache({ key: true })
    configuracion(id: string) {
        return this.server.get(`${this.organizacionUrl}/${id}/configuracion`);
    }

    get(param: any): Observable<any[]> {
        return this.server.get(this.organizacionUrl, { params: param, showError: true });
    }

}
