import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConnectorService } from '../connector.service';

@Component({
  selector: 'app-attributeplain',
  imports: [CommonModule],
  templateUrl: './attributeplain.component.html',
  styleUrl: './attributeplain.component.css'
})
export class AttributeplainComponent implements OnInit {

constructor(private svc: ConnectorService) {}

  @Output() onBack = new EventEmitter<void>();
  attributesCatalog: any[] = [];

  ngOnInit(): void {
    this.loadAttributesCatalog();
  }

  loadAttributesCatalog() {
    this.svc.getAttributesList().subscribe({
      next: (res: any) => {
        if (res.state === 'SUCCESS') {
          this.attributesCatalog = res.data;
        }
      },
      error: (err: any) => console.error(err)
    });
  }

  back() {
    this.onBack.emit();
  }

  // Variables nuevas para el detalle
showImpactModal: boolean = false;
selectedAttrName: string = '';
impacts: any[] = [];
isLoadingDetails: boolean = false;

/**
 * Consulta el detalle de impactos para un atributo específico
 */
searchImpactsByAttr(attrName: string) {
  this.selectedAttrName = attrName;
  this.showImpactModal = true;
  this.isLoadingDetails = true;
  this.impacts = [];

  // Llamada al servicio con el parámetro attributeOIM
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

closeModal() {
  this.showImpactModal = false;
}

}
