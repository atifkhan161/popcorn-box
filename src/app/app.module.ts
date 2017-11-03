import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { RouterModule, Routes } from '@angular/router';
import { AlertModule,TabsModule, BsDropdownModule,RatingModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MovieContainerComponent } from './movie-container/movie-container.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { TvContainerComponent } from './tv-container/tv-container.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TvDetailComponent } from './tv-detail/tv-detail.component';

import { traktService } from './services/trakt.services';
import { ytsService } from './services/yts.service';

export const appRoutes:Routes = [
   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
   { path: 'dashboard', component: DashboardComponent},
   { path: 'movies', component: MovieContainerComponent},
   { path: 'tv-shows', component: TvContainerComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MovieContainerComponent,
    ItemCardComponent,
    TvContainerComponent,
    MovieDetailsComponent,
    DashboardComponent,
    TvDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    RatingModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [
    traktService,
    ytsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


