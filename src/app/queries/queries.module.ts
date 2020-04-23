import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

// components
import { QueryExecuteComponent } from './componentes/query-execute.component';
import { QueriesGeneratorService } from './services/query-generator.service';
import { QueriesRoutingModule } from 'src/app/queries/queries-routing.module';
import { OrganizacionService } from 'src/app/services/organizacion.service';

@NgModule({
  declarations: [
    QueryExecuteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    QueriesRoutingModule
  ],
  providers: [QueriesGeneratorService, OrganizacionService],
  entryComponents: []
})
export class QueriesModule { }
