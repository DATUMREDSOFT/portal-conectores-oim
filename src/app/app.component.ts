import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AttributeplainComponent } from './attributeplain/attributeplain.component';
import { ConnectorService } from './connector.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AttributeplainComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // --- Variables de Estado y UI ---
  title = 'portal-conectores-oim';
  activeSection: string = 'list';
  showFloatingMenu: boolean = false;
  selectedInstanceName: string = '';
  currentApp: any = null;

  // --- Variables de Datos ---
  allConnectors: any[] = [];      // Fuente de verdad (todos los datos del servidor)
  filteredConnectors: any[] = [];   // Resultado del filtro de búsqueda
  pagedConnectors: any[] = [];      // Datos que se muestran en la página actual
  attributesCatalog: any[] = [];    // Catálogo para la sección de atributos

  // --- Variables de Paginación y Filtro ---
  searchText: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 8;
  totalPages: number = 1;

  // --- Variables de Modales ---
  showModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';

  constructor(private svc: ConnectorService) { }

  ngOnInit() {
    this.loadList();
  }

  // --- Lógica de Catálogo de Conectores ---

  loadList() {
    this.svc.getConnectorList().subscribe(res => {
      if (res.state === 'SUCCESS') {
        this.allConnectors = res.data;
        // Al inicio, la lista filtrada es igual a la completa
        this.filteredConnectors = [...this.allConnectors];
        this.calculatePages();
        this.updatePage();
      }
    });
  }

  /**
   * Filtra los conectores por nombre o descripción en tiempo real
   */
  filterConnectors() {
    const term = this.searchText.toLowerCase().trim();
    
    // Filtramos sobre la fuente de verdad original
    this.filteredConnectors = this.allConnectors.filter(c => 
      c.instanceName.toLowerCase().includes(term) || 
      c.instanceDisplayName.toLowerCase().includes(term)
    );

    this.currentPage = 1; // Siempre regresamos a la página 1 tras filtrar
    this.calculatePages();
    this.updatePage();
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.filteredConnectors.length / this.rowsPerPage) || 1;
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    // La paginación siempre se aplica sobre los resultados filtrados
    this.pagedConnectors = this.filteredConnectors.slice(start, start + this.rowsPerPage);
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

  // --- Lógica de Sección Atributos (Plano de Atributos) ---

  goToAttributePlain() {
    this.activeSection = 'attribute-plain';
    this.showFloatingMenu = false;
    this.loadAttributesCatalog();
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

  // --- Lógica de Modales Generales ---

  openModal(title: string, content: string) {
    this.modalTitle = title;
    this.modalContent = content;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}