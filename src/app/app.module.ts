import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { RouterModule, Routes } from '@angular/router';
import { AlertModule,TabsModule, BsDropdownModule,RatingModule, AccordionModule } from 'ngx-bootstrap';
import { SlimScroll } from 'angular-io-slimscroll';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MovieContainerComponent } from './movie-container/movie-container.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { ShowCardComponent } from './show-card/show-card.component';
import { TvContainerComponent } from './tv-container/tv-container.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ShowsApiService } from './services/showapiservices';
import { traktService } from './services/trakt.services';
import { ytsService } from './services/yts.service';
import { AppStorageService } from './services/app.storage';
import { sourcesService } from './services/sources.service';
import { ShowDetailsComponent } from './show-details/show-details.component';
import {VideoJSComponent} from './video-js/videojs.component'

export const appRoutes:Routes = [
   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
   { path: 'dashboard', component: DashboardComponent},
   { path: 'movies', component: MovieContainerComponent},
   { path: 'tv-shows', component: TvContainerComponent},
   { path: 'show-details', component: ShowDetailsComponent}
]

@NgModule({
  declarations: [
    SlimScroll,
    VideoJSComponent,
    AppComponent,
    HeaderComponent,
    MovieContainerComponent,
    ItemCardComponent,
    TvContainerComponent,
    MovieDetailsComponent,
    DashboardComponent,
    ShowDetailsComponent,
    ShowCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    RatingModule.forRoot(),
    AccordionModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ShowsApiService,
    traktService,
    ytsService,
    sourcesService,
    AppStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


