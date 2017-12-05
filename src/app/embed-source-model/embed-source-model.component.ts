import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'embed-source-model',
  templateUrl: './embed-source-model.component.html',
  styleUrls: ['./embed-source-model.component.css']
})
export class EmbedSourceModelComponent implements OnInit {
  public title: string;
  public linkUrl: SafeResourceUrl;
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
