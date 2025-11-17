import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  imports: [RouterLink],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent {
 isAdmin = true;
  // --- Placeholder User Data ---
  // In a real app, this would come from a service or NgRx selector
  userName = 'Spider-User';
  avatarUrl = 'https://images.unsplash.com/photo-1531297484001-80022131c5a9?w=100';

  // --- Placeholder Dashboard Stats ---
  stats = [
    { value: 12, label: 'TOTAL PROJECTS', type: 'info' },
    { value: 3, label: 'ACTIVE TASKS', type: 'info' },
    { value: 5, label: 'ALERTS', type: 'alert' },
    { value: 7, label: 'TEAM MEMBERS', type: 'info' },
  ];

  // --- Placeholder Project Data ---
  projects: Project[] = [
    {
      name: 'Tic Tac Toe',
      description: 'An game build by me.',
      imageUrl: '',
      lastUpdate: '2025-10-14',
      link: '/tic-tac-toe',
    },
  ];
}
