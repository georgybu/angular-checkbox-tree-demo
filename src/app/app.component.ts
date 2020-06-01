import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITopology} from './models/ITopology';
import {ITopologyPropertiesMap} from './models/ITopologyPropertiesMap';

@Component({
  selector: 'm-root',
  template: `
      <m-tree *ngIf="topology"
              role="source"
              [topology]="topology"
              [topologyProperties]="topologyProperties"
              (checkNode)="onCheckNode($event, 'sourceChecked')"
              (expandNode)="onExpandNode($event, 'sourceExpanded')"></m-tree>

      <div class="actions">
          <button (click)="onAddClick()">add</button>
          <button (click)="onRemoveClick()">remove</button>
          <button (click)="onPrintSelected()">print right list to console</button>
      </div>

      <m-tree *ngIf="topology"
              role="selected"
              [topology]="topology"
              [topologyProperties]="topologyProperties"
              (checkNode)="onCheckNode($event, 'selectedChecked')"
              (expandNode)="onExpandNode($event, 'selectedExpanded')"></m-tree>
  `,
  styles: [`
      :host {
          display: flex;
          flex-direction: row;
      }

      m-tree {
          flex: 1;
      }
  `]
})
export class AppComponent implements OnInit {
  public topology: ITopology = null;
  public topologyProperties: ITopologyPropertiesMap = {};

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<ITopology>('/assets/data/minimalTopology.json').subscribe((result) => {
      this.topology = result;
    })
  }

  onAddClick() {
    Object.keys(this.topologyProperties).forEach(key => {
      if (this.topologyProperties[key].sourceChecked) {
        this.topologyProperties[key].selected = true;
        this.topologyProperties[key].sourceChecked = false;
      }
    });
  }

  onRemoveClick() {
    Object.keys(this.topologyProperties).forEach(key => {
      if (this.topologyProperties[key].selectedChecked) {
        this.topologyProperties[key].selected = false;
        this.topologyProperties[key].selectedChecked = false;
      }
    });
  }

  onCheckNode($event: any, field: string) {
    const toggleSubTree = (tree) => {
      const traverse = (node) => {
        if (!this.topologyProperties.hasOwnProperty(node.id)) {
          this.topologyProperties[node.id] = {}
        }
        this.topologyProperties[node.id][field] = $event.isChecked;
        if (node.children && node.children.length) {
          node.children.forEach(child => traverse(child));
        }
      };
      traverse(tree);
    };
    toggleSubTree($event.item);
  }

  onExpandNode($event: any, field: string) {
    if (!this.topologyProperties.hasOwnProperty($event.id)) {
      this.topologyProperties[$event.id] = {}
    }
    this.topologyProperties[$event.id][field] = $event.isExpanded;
  }

  onPrintSelected() {
    const selected = [];
    Object.keys(this.topologyProperties).forEach(key => {
      if (this.topologyProperties[key].selected) {
        selected.push(key);
      }
    });
    console.log(selected);
  }
}
