import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild
} from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { SystemService, SystemCategoryCreate, SystemCategoriesList, SystemCategory } from '@wa-motif-open-api/platform-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  EditService,
  EditServiceConfiguration
} from '../../../Grid/edit.service';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ConfirmationService } from 'primeng/api';
import { NotificationCenter, NotificationType } from '../../../../components/Commons/notification-center';

const LOG_TAG = '[CategoryPaneComponent]';

@Component({
  selector: 'wa-message-categories-category-pane',
  styleUrls: [
    './category-pane-component.scss',
    '../../message-categories-component-shared.scss'
  ],
  templateUrl: './category-pane-component.html'
})
export class CategoryPaneComponent implements OnInit {
  data: SystemCategoriesList = [];

  @Output() selectionChange: EventEmitter<SystemCategory> = new EventEmitter<SystemCategory>();
  private _domain: string;
  private _selectedCategory: SystemCategory;

  private editService: EditService = new EditService();
  private editServiceConfiguration: EditServiceConfiguration = {
    idField: 'name',
    dirtyField: 'isDirty',
    isNewField: 'isNew'
  };
  public formGroup: FormGroup;
  private editedRowIndex: number;

  @ViewChild('grid') _grid: GridComponent;

  constructor(
    private logger: NGXLogger,
    private systemService: SystemService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private notificationCenter: NotificationCenter
  ) {}

  ngOnInit() {
    this.logger.debug(LOG_TAG, 'Initializing...');
    this.reloadCategories();
  }

  private reloadCategories(): void {
    if (this._domain) {
      this.systemService.getSystemCategories(this._domain).subscribe(
        (data: SystemCategoriesList)  => {
          this.logger.debug(LOG_TAG, 'reloadCategories: ', data);
          this.data = data;
          this.editService.read(this.data, this.editServiceConfiguration);
          this._selectedCategory = null;
          this.selectionChange.emit(this._selectedCategory);
              },
        error => {
          this.logger.error(LOG_TAG, 'reloadCategories error: ', error);
        }
      );
    } else {
      this.data = [];
    }
  }

  onSelectionChange(event) {
    this.logger.debug(LOG_TAG, 'onSelectionChange: ', event);
    this._selectedCategory = event.selectedRows[0].dataItem;
    this.selectionChange.emit(this._selectedCategory);
  }

  @Input()
  set domain(domain: string) {
    this._domain = domain;
    this.reloadCategories();
  }

  get domain(): string {
    return this._domain;
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      name: dataItem.name
    });
  }

  removeClicked(): void {
    if (this._selectedCategory) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove the selected category ' + this._selectedCategory.name + ' ?',
        accept: () => {
          this.removeCategory(this._selectedCategory);
        }
      });
    }
  }

  private removeCategory(category: SystemCategory): void {
    this.systemService.deleteSystemCategory(this._domain, this._selectedCategory.name).subscribe( (data) => {

      this.logger.debug(LOG_TAG , 'System Category removed: ', category);

      this.notificationCenter.post({
          name: 'RemoveSystemCategorySuccess',
          title: 'System Category Delete',
          message: 'The system category has been deleted successfully.',
          type: NotificationType.Success
      });

      this.reloadCategories();

    }, (error) => {

      this.logger.error(LOG_TAG , 'removecategory error: ', error);

      this.notificationCenter.post({
          name: 'RemoveSystemCategoryError',
          title: 'System Category Delete',
          message: 'Error deleting System Category:',
          type: NotificationType.Error,
          error: error,
          closable: true
      });

    });
  }

  addNewClicked(): void {
    this.formGroup = this.createFormGroup({
        name: 'New Category'
    });
    this._grid.addRow(this.formGroup);
  }

  /**
   * triggered by the grid
   */
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  public onKeydown(sender: any, e: any) {
      console.log('onKeydown ' + e.key);

      if (e.key === 'Escape') {
        this.closeEditor();
          // Stop parent form from submitting
        e.preventDefault();
      }

    if (e.key !== 'Enter') {
      return;
    }
    if (!this.formGroup || !this.formGroup.valid) {
      return;
    }

    this.createNewCategory(this.formGroup.value);

    // Stop parent form from submitting
    e.preventDefault();
  }

  /**
   * Create the new categroy on the server
   * @param newCategory
   */
  private createNewCategory(newCategory: SystemCategory) {
    const systemCategoryCreate: SystemCategoryCreate = {
        name: newCategory.name
    };
    this.systemService.createSystemCategory(this._domain, systemCategoryCreate).subscribe((data) => {
        this.logger.debug(LOG_TAG, 'createSystemCategory success: ', data);
        this.editService.create(newCategory);
        this.closeEditor();
    }, (error) => {
        this.logger.error(LOG_TAG, 'createSystemCategory error: ', error);
        this.closeEditor();
    });
  }

  private closeEditor() {
    this._grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
