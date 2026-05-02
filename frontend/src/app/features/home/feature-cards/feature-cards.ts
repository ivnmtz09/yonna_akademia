import { Component } from '@angular/core';

@Component({
  selector: 'app-feature-cards',
  standalone: true,
  templateUrl: './feature-cards.html',
})
export class FeatureCards {
  features = [
    {
      title: 'Cine Wayuu',
      description: 'Documentales y producciones audiovisuales que capturan la esencia de nuestras tradiciones.',
      icon: '🎬',
      colorClass: 'bg-rose-100 text-rose-600'
    },
    {
      title: 'Relatos y Mitos',
      description: 'Historias ancestrales contadas por los mayores, preservadas para las nuevas generaciones.',
      icon: '📚',
      colorClass: 'bg-amber-100 text-amber-600'
    },
    {
      title: 'Documentos Históricos',
      description: 'Archivos, fotografías e investigaciones sobre el desarrollo histórico de la península.',
      icon: '📜',
      colorClass: 'bg-emerald-100 text-emerald-600'
    }
  ];
}
