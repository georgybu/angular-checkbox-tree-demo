import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITopology} from '../../models/ITopology';
import {ITopologyPropertiesMap} from '../../models/ITopologyPropertiesMap';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'm-tree',
  template: `
      <div class="tree-node" *ngIf="role !== 'selected' || (role === 'selected' && properties.selected)">
          <span class="expand-collapse"
                *ngIf="hasChildren; else expandPlaceholder">
              <mat-icon *ngIf="!properties[role + 'Expanded']"
                        (click)="onExpandClick($event, topology, true)">keyboard_arrow_right</mat-icon>
              <mat-icon *ngIf="properties[role + 'Expanded']"
                        (click)="onExpandClick($event, topology, false)">expand_more</mat-icon>
          </span>

          <mat-checkbox [checked]="properties[role + 'Checked']" (change)="onToggleCheck($event, topology)">
              <span class="node-name" [innerHTML]="topology?.name"></span>
          </mat-checkbox>
      </div>

      <ng-container *ngIf="hasChildren && (properties[role + 'Expanded'] || (role === 'selected' && !properties.selected))">
          <m-tree *ngFor="let t of topology?.children; trackBy: trackByFn"
                  [topology]="t"
                  [role]="role"
                  [topologyProperties]="topologyProperties"
                  (checkNode)="checkNode.emit($event)"
                  (expandNode)="expandNode.emit($event)"></m-tree>
      </ng-container>

      <ng-template #expandPlaceholder>
          <span class="expand-placeholder"></span>
      </ng-template>
  `,
  styles: [`
      :host {
          display: block;
          padding-left: 16px;
      }

      .expand-collapse {
          cursor: pointer;
          display: inline-block;
          vertical-align: middle;
      }

      .expand-collapse:hover {
          color: darkblue;
      }

      .expand-placeholder {
          display: inline-block;
          width: 24px;
      }
  `]
})
export class TreeComponent implements OnInit {
  @Input() topology: ITopology;
  @Input() topologyProperties: ITopologyPropertiesMap;
  @Input() role: 'source' | 'selected';

  @Output() expandNode = new EventEmitter();
  @Output() checkNode = new EventEmitter();

  constructor() {
  }

  get properties() {
    return ((this.topologyProperties || {})[this.topology && this.topology.id]) || {};
  }

  get hasChildren() {
    return this.topology && this.topology.children && this.topology.children.length;
  }

  ngOnInit(): void {
  }

  trackByFn(index, item) {
    return item.id;
  }

  onExpandClick($event, topologyItem, isExpanded) {
    this.expandNode.emit({id: topologyItem.id, isExpanded});
    $event.stopPropagation();
  }

  onToggleCheck($event: MatCheckboxChange, topologyItem) {
    this.checkNode.emit({item: topologyItem, isChecked: $event.checked});
  }
}
