import { Component, OnInit,Input } from '@angular/core';
import {Show} from '../model/show.trakt';

@Component({
  selector: 'show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.css']
})
export class ShowCardComponent implements OnInit {
  @Input() show: Show;
  constructor() { }

  ngOnInit() {
  }

}
