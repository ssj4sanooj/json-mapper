import { Component, OnInit } from '@angular/core';
import { NodeService } from './nodeservice';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export interface NewTreeNode extends TreeNode {
    visible?: boolean;
    children?: NewTreeNode[];
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent {



    files1: TreeNode[];

    files2: TreeNode[];
    finalFile: TreeNode[];

    title = 'json-formatter';
    selectedFile: File;

    sourceData: NewTreeNode[] = [];
    targetData: NewTreeNode[] = [];

    selectedSourceNode: TreeNode;
    selectedTargetNode: TreeNode;


    constructor(private nodeService: NodeService,
        private http: HttpClient,
        private messageService: MessageService) { }

    ngOnInit() {

    }

    nodeSourceSelect(event) {
        console.log(event.node.data);

        this.messageService.add({ severity: 'info', summary: 'Source Node Selected', detail: event.node.label });
    }

    nodeSourceUnselect(event) {
        this.messageService.add({ severity: 'info', summary: 'Source Node Unselected', detail: event.node.label });
    }

    nodeTargetSelect(event) {
        this.messageService.add({ severity: 'info', summary: 'Target Node Selected', detail: event.node.label });
    }

    nodeTargetUnselect(event) {
        this.messageService.add({ severity: 'info', summary: 'Target Node Unselected', detail: event.node.label });
    }

    mapValue() {
        var error = 0;
        console.log(this.selectedTargetNode);

        if (this.selectedSourceNode == undefined) {
            this.messageService.add({ severity: 'error', summary: 'Please select source json', detail: "Please select source json" });
            error = 1;
        }
        if (this.selectedTargetNode == undefined && error == 0) {
            this.messageService.add({ severity: 'error', summary: 'Please select target json', detail: "Please select target json" });
            error = 1;
        }
        if (error == 0) {
            this.selectedTargetNode['data'] = this.selectedSourceNode['data'];
            this.selectedTargetNode['label'] = this.selectedTargetNode['label'].split(':')[0] + ' : ' + this.selectedSourceNode['data'];
            this.finalFile = this.files2;
        }
    }

    format_for_treeview(data, arr) {
        for (var key in data) {
            console.log("key", key);

            if (Array.isArray(data[key]) || data[key].toString() === "[object Object]") {
                // when data[key] is an array or object
                var nodes = [];
                var completedNodes = this.format_for_treeview(data[key], nodes);
                arr.push({
                    label: key,
                    children: completedNodes
                });
            } else {
                // when data[key] is just strings or integer values
                arr.push(
                    {
                        label: key + ' : ' + data[key],
                        "collapsedIcon": "pi pi-folder-open",
                        visible: true,
                        data: data[key]
                    }
                );
            }
        }
        return arr;
    }



    onSelected(event, target) {
        console.log("event", event);
        this.selectedFile = event.target.files[0];
        this.upload(target);
    }

    upload(target) {
        const fd = new FormData();
        fd.append('profile', this.selectedFile, this.selectedFile.name);

        console.log(this.selectedFile);
        this.http.post('http://localhost:4000/upload', fd).subscribe(res => {
            console.log("res", res);
            if (target == 'source') {
                this.sourceData = res['jsonData'];
                this.files1 = this.format_for_treeview(this.sourceData, []);
            } else {
                this.targetData = res['jsonData'];
                this.files2 = this.format_for_treeview(this.targetData, []);
            }
        })
    }

    expandAll() {
        this.files2.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.files2.forEach(node => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }
}
