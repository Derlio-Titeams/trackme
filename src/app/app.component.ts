import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TrackMe';
  isLoading = true;
  isMuted = true; // Nuevo estado para el mute
  audio: HTMLAudioElement | null = null; // Referencia al audio

  ngOnInit(): void {
    this.preloadResources();
  }

  getHelp() {
    Swal.fire('Construcción', 'El sitio se encuentra en construcción', 'info');
  }

  preloadResources(): void {
    // Referencia al GIF
    const gif = new Image();
    gif.src = 'assets/images/background.gif';

    // Referencia al audio
    this.audio = new Audio('assets/sounds/background.mp3');

    // Eventos para detectar cuando los recursos están listos
    const gifLoaded = new Promise<void>((resolve) => {
      gif.onload = () => resolve();
      setTimeout(() => resolve(), 5000); // Respaldo en caso de GIF lento
    });

    const audioLoaded = new Promise<void>((resolve) => {
      this.audio?.addEventListener('loadeddata', () => resolve(), { once: true });
      this.audio?.play().catch(() => resolve()); // Resolver si autoplay falla
    });

    // Esperar a que ambos recursos estén listos
    Promise.all([gifLoaded, audioLoaded]).then(() => {
      this.isLoading = false; // Ocultar el preloader
      this.audio?.play().catch(() => console.warn('Autoplay bloqueado en dispositivos móviles'));
      if (this.audio) {
        this.audio.muted = this.isMuted;
        this.audio.volume = 0.4; // Volumen al 40%
      }
    }).catch(() => {
      console.warn('Algunos recursos no se pudieron cargar, continuando...');
      this.isLoading = false;
    });
  }

  toggleMute(): void {
    if (this.audio) {
      this.isMuted = !this.isMuted; // Cambiar el estado de mute
      this.audio.muted = this.isMuted; // Activar o desactivar mute
    }
  }
}
