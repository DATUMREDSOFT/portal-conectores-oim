import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  private API_LIST = 'https://oim-test.mh.gob.sv/PortalInformacionConectoresOIMBE/resources/api/docs/instancesconnectors/list';
  private API_DETAIL = 'https://oim-test.mh.gob.sv/PortalInformacionConectoresOIMBE/resources/api/docs/instancesconnectors/completeInfo';
  private API_ATTRS = 'https://oim-test.mh.gob.sv/PortalInformacionConectoresOIMBE/resources/api/docs/instancesconnectors/attributesList';
  private API_PLAIN = 'https://oim-test.mh.gob.sv/PortalInformacionConectoresOIMBE/resources/api/docs/instancesconnectors/InstancesPlain';

  private API_CRUD_ATTR = 'https://oim-test.mh.gob.sv/PortalInformacionConectoresOIMBE/resources/api/desc/attr';

  constructor(private http: HttpClient) {}
  
  getAttributesList(): Observable<any> {
    return this.http.get(this.API_ATTRS);
  }

  getConnectorList(): Observable<any> {
    return this.http.get(this.API_LIST);
  }

  getConnectorDetail(appName: string): Observable<any> {
    return this.http.get(`${this.API_DETAIL}?appName=${appName}`);
  }

   getInstancesPlain(attributeOIM: string): Observable<any> {
    return this.http.get(`${this.API_PLAIN}?attributeOIM=${attributeOIM}`);
  }

  createAttribute(attr: any): Observable<any> {
    return this.http.post(this.API_CRUD_ATTR+'/create', attr);
  }

  updateAttribute(attr: any): Observable<any> {
    return this.http.post(this.API_CRUD_ATTR+'/update', attr);
  }


  deleteAttribute(attrId: number): Observable<any> {
    return this.http.delete(this.API_CRUD_ATTR+'/delete?id='+attrId);
  }

}
