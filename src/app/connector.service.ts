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

}
