import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '@andes/auth';
import { Server } from '@andes/shared';
// import { IPrestacion } from '../interfaces/prestacion.interface';

@Injectable()
export class AdjuntosService {

    private url = '/modules/registro-novedades';  // URL to web api

    constructor(private server: Server, public auth: Auth) { }

    /**
     *
     * @param params.id id devuelto por el metodo post.
     * @param params.estado estado para filtrar.
     */

    get(params) {
        return this.server.get(this.url, { params });
    }


    /**
     * Borra una solicitud de ajuntar archivo
     */
    delete(id) {
        return this.server.delete(this.url + '/' + id);
    }

    /**
     * Upload a file
     * @param {string} file  Archivo en Base64
     */
    upload(file, metadata) {
        return this.server.post(this.url + '/store', { file, metadata });
    }

    /**
     * Genera un token de archivo
     */

    generateToken() {
        return this.server.post('/auth/file-token', {});
    }
}