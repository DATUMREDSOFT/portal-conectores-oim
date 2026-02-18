import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConnectorService } from '../connector.service';

@Component({
  selector: 'app-attributeplain',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './attributeplain.component.html',
  styleUrl: './attributeplain.component.css'
})
export class AttributeplainComponent implements OnInit {

  @Output() onBack = new EventEmitter<void>();

  // --- Variables de Datos ---
  attributesCatalog: any[] = [];         // Fuente de verdad original
  filteredAttributesCatalog: any[] = [];  // Lista intermedia filtrada
  pagedAttributes: any[] = [];           // La lista final que se renderiza en la tabla
  searchTextAttr: string = '';           // Variable del buscador

  // --- Variables de Paginación ---
  currentPage: number = 1;
  rowsPerPage: number = 5;
  totalPages: number = 1;

  // --- Variables UI / Modales ---
  showImpactModal: boolean = false;
  showFormModal: boolean = false;
  isEditMode: boolean = false;
  isMatrixView: boolean = false;
  isLoadingDetails: boolean = false;
  selectedAttrName: string = '';
  impacts: any[] = [];
  tempAttr: any = { attrId: null, attrName: '', attrDesc: '' };

  constructor(private svc: ConnectorService) { }

  ngOnInit(): void {
    this.loadAttributesCatalog();
  }

  /**
   * Carga el catálogo y activa la cadena de filtro/paginación
   */
  loadAttributesCatalog() {
    this.svc.getAttributesList().subscribe({
      next: (res: any) => {
        if (res.state === 'SUCCESS') {
          this.attributesCatalog = res.data;
          this.filterAttributes(); // Al cargar, aplicamos filtro y paginación automáticamente
        }
      },
      error: (err: any) => console.error("Error al cargar catálogo:", err)
    });
  }

  /**
   * 1. Filtra los datos según el buscador
   */
  filterAttributes() {
    const term = this.searchTextAttr.toLowerCase().trim();
    
    this.filteredAttributesCatalog = this.attributesCatalog.filter(attr =>
      attr.attrName.toLowerCase().includes(term) ||
      attr.attrDesc.toLowerCase().includes(term)
    );

    this.currentPage = 1; // Reiniciar a página 1 tras filtrar
    this.calculatePages();
    this.updatePagedList();
  }

  /**
   * 2. Calcula el total de páginas
   */
  calculatePages() {
    this.totalPages = Math.ceil(this.filteredAttributesCatalog.length / this.rowsPerPage) || 1;
  }

  /**
   * 3. Rebana el arreglo filtrado para mostrar solo la página actual
   */
  updatePagedList() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    this.pagedAttributes = this.filteredAttributesCatalog.slice(start, start + this.rowsPerPage);
  }

  changePage(step: number) {
    this.currentPage += step;
    this.updatePagedList();
  }

  // --- Lógica de Vistas e Impactos ---

  showGeneralVision(attrName: string) {
    this.selectedAttrName = attrName;
    this.isLoadingDetails = true;
    this.isMatrixView = true;
    this.impacts = []; 
    
    this.svc.getInstancesPlain(attrName).subscribe({
      next: (res: any) => {
        if (res.state === 'SUCCESS') {
          this.impacts = res.data;
        }
        this.isLoadingDetails = false;
      },
      error: (err: any) => {
        console.error("Error al cargar matriz:", err);
        this.isLoadingDetails = false;
      }
    });
  }

  searchImpactsByAttr(attrName: string) {
    this.selectedAttrName = attrName;
    this.showImpactModal = true;
    this.isLoadingDetails = true;
    this.impacts = [];

    this.svc.getInstancesPlain(attrName).subscribe({
      next: (res: any) => {
        if (res.state === 'SUCCESS') {
          this.impacts = res.data;
        }
        this.isLoadingDetails = false;
      },
      error: (err: any) => {
        console.error("Error al obtener impactos:", err);
        this.isLoadingDetails = false;
      }
    });
  }

  // --- Lógica CRUD ---

  saveAttribute() {
    if (this.isEditMode) {
      if (this.tempAttr.attrId) this.updateAttribute(this.tempAttr);
    } else {
      this.saveNewAttribute(this.tempAttr);
    }
  }

  saveNewAttribute(attrData: any) {
    this.svc.createAttribute(attrData).subscribe({
      next: (res: any) => {
        if (res.state === 'SUCCESS') this.finalizeAction();
      }
    });
  }

  updateAttribute(attrData: any) {
    this.svc.updateAttribute(attrData).subscribe({
      next: (res: any) => {
        if (res.state === 'SUCCESS') this.finalizeAction();
      }
    });
  }

  confirmDelete(id: number) {
    if (confirm('¿Está seguro de eliminar este atributo?')) {
      this.svc.deleteAttribute(id).subscribe({
        next: (res: any) => {
          if (res.state === 'SUCCESS') this.loadAttributesCatalog();
        }
      });
    }
  }

  finalizeAction() {
    this.showFormModal = false;
    this.isEditMode = false;
    this.tempAttr = { attrId: null, attrName: '', attrDesc: '' };
    this.loadAttributesCatalog();
  }

  // --- Helpers Matrix ---

  getEnvName(instance: string): string {
    const name = instance.toUpperCase();
    return (name.includes('DESA') || name.startsWith('SIDUNEA')) ? 'Desarrollo' : 'Test';
  }

  getEnvClass(instance: string): string {
    return this.getEnvName(instance) === 'Desarrollo' ? 'env-desa' : 'env-test';
  }

  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.impacts, event.previousIndex, event.currentIndex);
  }

  back() { this.onBack.emit(); }
  closeModal() { this.showImpactModal = false; }
  openAddModal() {
    this.isEditMode = false;
    this.tempAttr = { attrId: null, attrName: '', attrDesc: '' };
    this.showFormModal = true;
  }
  openEditModal(attr: any) {
    this.isEditMode = true;
    this.tempAttr = { ...attr };
    this.showFormModal = true;
  }
}