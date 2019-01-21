import { CatalogEntry } from './model';
import { Service, ServiceOperation } from '@wa-motif-open-api/catalog-service';
import { Application, Domain } from '@wa-motif-open-api/platform-service';
import { TreeNode } from 'primeng/api';
import * as uuidv1 from 'uuid/v1';

export interface CatalogEntry {
  domain: string;
  application?: string;
  service?: string;
  operation?: string;
  channel?: string;
}

