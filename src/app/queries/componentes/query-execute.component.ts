import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { QueriesGeneratorService } from '../services/query-generator.service';
import { Slug } from 'ng2-slugify';
import { ConceptoTruneableService } from '../../conceptos-turneables/services/concepto-turneable.service';
import { OrganizacionService } from '../../services/organizacion.service';

@Component({
    selector: 'app-query-execute',
    templateUrl: './query-execute.component.html'
})

export class QueryExecuteComponent implements OnInit {

    public selectConsulta;
    private listaArgumentos;
    public listaFiltro = [];
    private slug: Slug = new Slug('default');

    constructor(
        private plex: Plex, private biService: QueriesGeneratorService,
        private conceptoTurneableService: ConceptoTruneableService,
        private servicioOrganizacion: OrganizacionService
    ) {
        this.biService.getAllQueries().subscribe(
            resultado => this.listaFiltro = resultado,
            err => this.mostrarError()
        );
    }

    ngOnInit() {

    }

    descargar($event) {
        if (!$event.formValid) {
            return;
        } else {
            let params = {
                
            }
            this.biService.descargar(this.selectConsulta, params).subscribe(data => {
                    console.log(data)
                    let blob = new Blob([data], { type: data.type });
                    saveAs(blob, this.slug.slugify('Internaciones' + ' ' + moment().format('DD-MM-YYYY-hmmss')) + '.xlsx');
                },
                err => this.mostrarError()
            );
        }
        
    }

    elegirConsulta() {
        if (this.selectConsulta) {
            // lista con datos de los componenetes a crear
            this.listaArgumentos = this.selectConsulta.argumentos;
        }
    }

    loadConceptosTurneables(event) {
        this.conceptoTurneableService.get({ turneable: 1 }).subscribe((data: any) => {
            event.callback(data);
        });
    }

    loadOrganizaciones(event) {
        if (event.query) {
            const query = {
                nombre: event.query
            };
            this.servicioOrganizacion.get(query).subscribe(resultado => {
                event.callback(resultado);
            });
        } else {
            event.callback([]);
        }
    }

    mostrarError() {
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Queries');
    }


}

