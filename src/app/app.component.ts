import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AttributeplainComponent } from './attributeplain/attributeplain.component';
import { ConnectorService } from './connector.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule,AttributeplainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {

//Inicio de seccion attributes plain

  // Agrega esto a tus variables existentes
showFloatingMenu: boolean = false;
// 1. Agregamos la variable para el catálogo
attributesCatalog: any[] = [];

// 2. Modificamos la función para que cargue los datos al navegar
goToAttributePlain() {
  this.activeSection = 'attribute-plain';
  this.showFloatingMenu = false;
  this.loadAttributesCatalog(); // Llamada al nuevo servicio
}

loadAttributesCatalog() {
  this.svc.getAttributesList().subscribe({
    next: (res) => {
      if (res.state === 'SUCCESS') {
        this.attributesCatalog = res.data;
      }
    },
    error: (err) => console.error("Error al cargar catálogo de atributos", err)
  });
}

searchImpactsByAttr(attr:any){

}

//fin de seccion attributes plain
  
  // Agrega estas variables a tu clase
showModal: boolean = false;
modalTitle: string = '';
modalContent: string = '';

// Función para abrir el modal
openModal(title: string, content: string) {
  this.modalTitle = title;
  this.modalContent = content;
  this.showModal = true;
}

// Función para cerrar
closeModal() {
  this.showModal = false;
}
  
  selectedInstanceName: string = '';

  title = 'portal-conectores-oim';
  allConnectors: any[] = [];
  pagedConnectors: any[] = [];
  currentApp: any = null;
  activeSection: string = 'list';
  
  // Paginación
  currentPage: number = 1;
  rowsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private svc: ConnectorService) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.svc.getConnectorList().subscribe(res => {
      if (res.state === 'SUCCESS') {
        this.allConnectors = res.data;
        this.totalPages = Math.ceil(this.allConnectors.length / this.rowsPerPage);
        this.updatePage();
      }
    });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    this.pagedConnectors = this.allConnectors.slice(start, start + this.rowsPerPage);
  }

  changePage(step: number) {
    this.currentPage += step;
    this.updatePage();
  }

  viewDetail(appName: string) {
    this.selectedInstanceName = appName;
    
    this.svc.getConnectorDetail(appName).subscribe(res => {
      if (res.state === 'SUCCESS') {
        this.currentApp = res.data[0];
        this.activeSection = 'description';
      }
    });
  }

  setSection(section: string) {
    if (!this.currentApp && section !== 'list') {
      alert('Seleccione un conector primero.');
      return;
    }
    this.activeSection = section;
  }


}
