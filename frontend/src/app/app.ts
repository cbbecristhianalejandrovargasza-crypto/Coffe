import { HttpClient } from '@angular/common/http';
import {
  Component, computed, inject, signal, type OnInit, type WritableSignal,
} from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import { finalize } from 'rxjs';

interface Cafeteria {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string | null;
  horario: string;
  historia: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Producto extends Servicio {
  precio: string;
  especialidad: 0 | 1;
}

interface Multimedia {
  id: number;
  tipo: 'video' | 'foto';
  titulo: string;
  descripcion: string;
  url: string;
  poster: string | null;
}

interface MensajeChat {
  autor: 'Tú' | 'CoffeeHouse';
  texto: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);

  readonly cafeteria = signal<Cafeteria | null>(null);
  readonly servicios = signal<Servicio[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly multimedia = signal<Multimedia[]>([]);
  readonly errores = signal<string[]>([]);

  readonly portada = computed(() => this.multimedia().find((medio) => medio.tipo === 'video'));
  readonly fotos = computed(() => this.multimedia().filter((medio) => medio.tipo === 'foto'));
  readonly especialidades = computed(() =>
    this.productos().filter((producto) => producto.especialidad === 1),
  );

  readonly reproducirAuto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly videoEnMarcha = signal(false);

  readonly enviandoContacto = signal(false);
  readonly estadoContacto = signal('');

  readonly esperandoChat = signal(false);
  readonly errorChat = signal('');
  readonly chat = signal<MensajeChat[]>([]);

  ngOnInit(): void {
    this.cargar('cafeteria', this.cafeteria, 'los datos de la cafetería');
    this.cargar('servicios', this.servicios, 'los servicios');
    this.cargar('productos', this.productos, 'el menú');
    this.cargar('multimedia', this.multimedia, 'el video y las fotos');
  }

  private cargar<T>(ruta: string, destino: WritableSignal<T>, etiqueta: string): void {
    this.http.get<T>(`/api/${ruta}`).subscribe({
      next: (datos) => destino.set(datos),
      error: () => this.errores.update((lista) => [...lista, `No se pudo cargar ${etiqueta}.`]),
    });
  }

  alternarVideo(video: HTMLVideoElement): void {
    if (video.paused) {
      void video.play().catch(() => this.videoEnMarcha.set(false));
    } else {
      video.pause();
    }
  }

  enviarContacto(formulario: NgForm): void {
    if (formulario.invalid || this.enviandoContacto()) return;

    this.estadoContacto.set('');
    this.enviandoContacto.set(true);

    this.http.post<{ mensaje: string }>('/api/contactos', formulario.value)
      .pipe(finalize(() => this.enviandoContacto.set(false)))
      .subscribe({
        next: (datos) => {
          this.estadoContacto.set(datos.mensaje);
          formulario.resetForm();
        },
        error: (respuesta) => {
          this.estadoContacto.set(respuesta.error?.error || 'No se pudo enviar el mensaje.');
        },
      });
  }

  enviarPregunta(formulario: NgForm): void {
    const prompt = String(formulario.value.pregunta ?? '').trim();
    if (!prompt || formulario.invalid || this.esperandoChat()) return;

    this.chat.update((mensajes) => [...mensajes, { autor: 'Tú', texto: prompt }]);
    this.errorChat.set('');
    this.esperandoChat.set(true);
    formulario.resetForm();

    this.http.post<{ response: string }>('/api/chatbot', { prompt })
      .pipe(finalize(() => this.esperandoChat.set(false)))
      .subscribe({
        next: (datos) => this.chat.update((mensajes) => [
          ...mensajes, { autor: 'CoffeeHouse', texto: datos.response },
        ]),
        error: (respuesta) => {
          this.errorChat.set(respuesta.error?.error || 'No se pudo consultar el chatbot.');
        },
      });
  }
}