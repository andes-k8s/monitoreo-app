import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private menuList = [];

  constructor(public server: Server, public plex: Plex, public auth: Auth) {
    server.setBaseURL(environment.API);

    this.plex.updateTitle('ANDES | Monitoreo');
    const token = this.auth.getToken();
    if (token) {
      this.auth.session().subscribe(() => {
        // Inicializa el menú
        this.crearMenu();
      });
    }
  }

  public crearMenu() {
    this.menuList = [];
    if (this.auth.loggedIn()) {
      this.auth.organizaciones().subscribe(data => {
        if (data.length > 1) {
          this.menuList = [{ label: 'Seleccionar Organización', icon: 'home', route: '/login/select-organizacion' }, ...this.menuList];
          this.plex.updateMenu(this.menuList);
        }
      });
    }
    this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
    this.menuList.push({ label: 'Webhooks', icon: 'hook', route: '/webhook' });
    this.menuList.push({ label: 'Conceptos Turneables', icon: 'clipboard-check', route: '/conceptos-turneables' });
    this.menuList.push({ label: 'Monitoreo Activaciones', icon: 'cellphone-basic', route: '/monitor-activaciones' });
    this.menuList.push({ label: 'WebhookLogs', icon: 'webhook', route: '/webhooklog' });
    this.menuList.push({ label: 'Buscador SNOMED', icon: 'magnify', route: '/buscador-snomed' });
    this.menuList.push({ label: 'BI Queries', icon: 'database-search', route: '/queries' });
    this.menuList.push({ label: 'Regenerar CDAs', icon: 'refresh', route: '/cda-regenerar' });
    this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login/logout' });
    this.menuList.push({ label: 'Novedades', icon: 'bell-outline', route: '/novedades' });
    this.plex.updateMenu(this.menuList);
  }
}
