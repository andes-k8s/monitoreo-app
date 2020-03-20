import { ModuloService } from '../services/modulo.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';

import { INovedad } from '../interfaces/INovedad.interface';
import { IModulo } from '../interfaces/IModulo.interface';
import { NovedadesService } from '../services/novedades.service';
import { AdjuntosService } from '../services/adjuntos.service';

const limit = 10;

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NovedadesComponent implements OnInit {
  @ViewChild('upload', { static: true }) uploadElement: ElementRef; // uploadElement

  public main = 12; // tamaño vista pantalla

  // scroll infinito
  private skip;
  private finScroll = false;

  // títulos

  public regNov: INovedad;
  public listRegNovedades: INovedad[];
  public titulo: string;
  public modulo: IModulo;
  public titleABM: string;
  public listModulos: IModulo[] = [];
  private modoEdit: boolean;
  public mostrarVacio: boolean;

  // Adjuntar Imagenes
  errorExt = false;
  waiting = false;
  fileToken: string = null;
  timeout = null;
  lightbox = false;
  indice;
  documentos = [];
  extensions = ['bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];

  constructor(
    public plex: Plex,
    private regNovService: NovedadesService,
    private moduloService: ModuloService,
    public adjuntosService: AdjuntosService,
    public auth: Auth) {
    this.regNov = null;
    this.listRegNovedades = [];
    this.modoEdit = false;
  }

  ngOnInit() {

    this.loadData(false);
    this.skip = 0;
    this.moduloService.get({}).subscribe(
      modulos => {
        this.listModulos = modulos;
      },
      (err) => {
        this.listModulos = [];
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
      }
    );
    this.adjuntosService.generateToken().subscribe((data: any) => {
      this.fileToken = data.token;
    });
    this.loadRegNov();
  }

  nuevo() {
    this.abrirSidebar('Registar Novedad');
    this.loadRegNov();
  }

  cerrarSidebar() {
    this.main = 12;
    this.loadRegNov();
  }

  abrirSidebar(title) {
    this.main = 7;
    this.titleABM = title;
  }

  loadRegNov() {
    this.modoEdit = false;
    this.regNov = {
      titulo: '',
      fecha: new Date(),
      descripcion: '',
      imagenes: [],
      modulo: null,
      activa: true
    };
  }

  verRegistro(nov: INovedad = null) {
    this.abrirSidebar('Editar Novedad');
    if (nov) {
      this.regNov = Object.assign({}, nov);
    }
    this.modoEdit = true;
  }

  creaModificaNovedad() {
    this.regNov.imagenes = this.fotos;
    if (this.modoEdit) { // editar novedad;
      this.regNovService.patch(this.regNov).subscribe(
        () => {
          this.loadData(false);
          this.plex.toast('success', 'Los datos se editaron correctamente');
        },
        (err) => {
          this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
        }
      );
    } else { // crear novedad

      this.regNovService.post(this.regNov).subscribe(
        () => {
          this.loadData(false);
          this.plex.toast('success', 'Los datos se guardaron correctamente');
        },
        (err) => {
          this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
        }
      );
    }
    this.cerrarSidebar();
  }

  loadData(concatenar: boolean = false) {
    this.main = 12;
    if (!concatenar) { this.skip = 0; }

    const params: any = {
      limit,
      skip: this.skip
    };
    if (this.titulo) {
      params.titulo = this.titulo;
    }
    if (this.modulo) {
      params.modulos = this.modulo._id;
    }
    this.regNovService.get(params).subscribe(
      registros => {
        if (concatenar) { // scroll infinito
          if (registros.length > 0) {
            this.listRegNovedades = this.listRegNovedades.concat(registros);
            this.skip += limit;
          }
          this.finScroll = !(registros.length > 0);
        } else {
          this.listRegNovedades = registros;
          this.skip += limit;
          this.finScroll = false;
        }
      },
      (err) => {
        this.listRegNovedades = [];
        this.skip = 0;
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
      }
    );
  }

  // MÉTODOS PARA CARGAR, CAMBIAR, BORRAR Y VER LAS IMAGENES

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const ext = this.fileExtension(inputValue.value); // obtenemos la extensión de archivo
    this.errorExt = false;
    if (!this.extensions.find((item) => item === ext.toLowerCase())) {
      this.uploadElement.nativeElement.value = '';
      this.errorExt = true;
      this.plex.toast('danger', 'Tipo de archivo incorrecto');
      return;
    }
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.uploadElement.nativeElement.value = '';
      const metadata = {};
      this.adjuntosService.upload(myReader.result, metadata).subscribe((data) => {
        this.regNov.imagenes.push({
          ext,
          id: data._id
        });
      });
    };
    myReader.readAsDataURL(file);
  }


  fileExtension(file) {
    if (file.lastIndexOf('.') >= 0) {
      return file.slice((file.lastIndexOf('.') + 1));
    } else {
      return '';
    }
  }

  cancelarAdjunto() {
    clearTimeout(this.timeout);
    this.waiting = false;
  }

  activaLightbox(index) { // activa a vista previa de las imagenes
    this.lightbox = true;
    this.indice = index;
  }

  esImagen(extension) {
    return this.extensions.find(x => x === extension.toLowerCase());
  }

  imageRemoved($event) {
    const index = this.fotos.indexOf($event);
    this.fotos.splice(index, 1);
  }

  createUrl(doc) { // creo que se debería pasar al servicio para que no se tenga que importar environment
    /** Hack momentaneo */
    if (doc.id) {
      return this.regNovService.getUrlImage(doc.id, this.fileToken);
    }
  }
  imagenPrevia(i) {
    const imagenPrevia = i - 1;
    if (imagenPrevia >= 0) {
      this.indice = imagenPrevia;
    }
  }

  imagenSiguiente(i) {
    const imagenSiguiente = i + 1;
    if (imagenSiguiente <= this.fotos.length - 1) {
      this.indice = imagenSiguiente;
    }
  }

  get fotos() {
    if (this.regNov && this.regNov.imagenes) {
      return this.regNov.imagenes.map((doc: any) => {
        doc.url = this.createUrl(doc);
        return doc;
      });
    } else {
      return [];
    }
  }


}