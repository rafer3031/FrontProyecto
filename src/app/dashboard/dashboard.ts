import {
  Component,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenav } from '@angular/material/sidenav';

interface NFTItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  image: string;
  instantPrice: number;
  lastBid: number;
  lastBidUSD: number;
  timeLeft: string;
}

interface AuctionItem {
  name: string;
  creator: string;
  avatar: string;
  openPrice: number;
  priceUSD: number;
  recentOffer: number;
  timeLeft: string;
}

@Component({
  selector: 'app-nft-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatBadgeModule,
  ],
  templateUrl: './dashboard.html',
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }

      .mat-mdc-list-item {
        border-radius: 8px !important;
        margin-bottom: 4px !important;
      }

      .mat-mdc-list-item.mdc-list-item--activated {
        background-color: rgb(55 65 81) !important;
      }

      .mat-mdc-card {
        background-color: rgb(31 41 55) !important;
        border: 1px solid rgb(55 65 81) !important;
      }

      .mat-mdc-raised-button.mat-primary {
        background-color: rgb(249 115 22) !important;
      }

      .mat-mdc-outlined-button {
        border-color: rgb(75 85 99) !important;
        color: white !important;
      }

      .mat-drawer-container {
        background-color: rgb(17 24 39) !important;
      }

      .mat-drawer {
        background-color: rgb(31 41 55) !important;
        border-right: 1px solid rgb(55 65 81) !important;
      }

      .mat-toolbar {
        background-color: rgb(31 41 55) !important;
        border-bottom: 1px solid rgb(55 65 81) !important;
      }

      @media (max-width: 768px) {
        .mat-drawer-side {
          border: none !important;
        }

        .mat-drawer-backdrop.mat-drawer-shown {
          background-color: rgba(0, 0, 0, 0.6) !important;
        }
      }
    `,
  ],
})
export default class NFTDashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isHandset = window.innerWidth < 768;

    if (this.isHandset) {
      // Mobile: use overlay mode, closed by default
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    } else {
      // Desktop: use side mode, open by default
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    }
  }

  toggleSidenav() {
    if (this.isHandset) {
      // Mobile: toggle the sidenav
      this.sidenav.toggle();
    } else {
      // Desktop: toggle opened state
      this.sidenavOpened = !this.sidenavOpened;
    }
  }
  otherNFTs: NFTItem[] = [
    {
      id: '1',
      title: 'Pupaks',
      creator: 'Artist Name',
      creatorAvatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      instantPrice: 2.5,
      lastBid: 0.35,
      lastBidUSD: 548.79,
      timeLeft: '2h 15m',
    },
    {
      id: '2',
      title: 'Seeing Green collection',
      creator: 'Digital Artist',
      creatorAvatar:
        'https://images.unsplash.com/photo-1494790108755-2616b31a7e8c?w=40&h=40&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=300&fit=crop',
      instantPrice: 1.8,
      lastBid: 0.15,
      lastBidUSD: 234.88,
      timeLeft: '4h 32m',
    },
  ];

  activeAuctions: AuctionItem[] = [
    {
      name: 'Cripto Cities',
      creator: 'Jenny Wilson',
      avatar:
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop',
      openPrice: 22,
      priceUSD: 35330.8,
      recentOffer: 22,
      timeLeft: '1h 43m 52s',
    },
    {
      name: 'Lady Ape Club',
      creator: 'Jenny Wilson',
      avatar:
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=40&h=40&fit=crop',
      openPrice: 2.9,
      priceUSD: 4812.72,
      recentOffer: 2.8,
      timeLeft: '2h 00m 02s',
    },
    {
      name: 'The King - Gordon Ryan',
      creator: 'Jenny Wilson',
      avatar:
        'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=40&h=40&fit=crop',
      openPrice: 2.9,
      priceUSD: 1602.77,
      recentOffer: 1,
      timeLeft: '1h 05m 00s',
    },
  ];
}
