import { Component, OnInit,Input } from '@angular/core';
import {Movie} from '../model/movie';

@Component({
  selector: 'item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
@Input() movie: Movie;
  constructor() { }

  ngOnInit() {
  }

}
