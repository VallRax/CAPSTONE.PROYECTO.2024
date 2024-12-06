import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserRole } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    rut: new FormControl('', [
      Validators.required,
      this.rutValidator,
    ]),
    role: new FormControl('client', Validators.required),
    contactNumber: new FormControl('', [Validators.required]),
    location: new FormGroup({
      region: new FormControl('', [Validators.required]),
      comuna: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      addressNumber: new FormControl(''),
      department: new FormControl(''),
    }),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  private readonly RUT_MAX_LENGTH = 12; // Máximo de caracteres formateados (99.999.999-9)

  // Lista de regiones y comunas de Chile
  regions = [
    {
      name: 'Arica y Parinacota',
      communes: ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    },
    {
      name: 'Tarapacá',
      communes: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Huara', 'Camiña', 'Colchane', 'Pica'],
    },
    {
      name: 'Antofagasta',
      communes: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama'],
    },
    {
      name: 'Atacama',
      communes: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Huasco'],
    },
    {
      name: 'Coquimbo',
      communes: [
        'La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paihuano', 'Vicuña', 'Illapel', 'Canela', 
        'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'
      ],
    },
    {
      name: 'Valparaíso',
      communes: [
        'Valparaíso', 'Viña del Mar', 'Concón', 'Quintero', 'Puchuncaví', 'Quilpué', 'Villa Alemana', 
        'Casablanca', 'San Antonio', 'Cartagena', 'El Quisco', 'El Tabo', 'Algarrobo', 'Los Andes', 
        'San Esteban', 'Calle Larga', 'Rinconada', 'San Felipe', 'Putaendo', 'Santa María', 'Panquehue', 
        'Llaillay', 'Catemu', 'Quillota', 'La Calera', 'Hijuelas', 'Nogales', 'Zapallar', 'Papudo', 
        'La Ligua', 'Petorca', 'Cabildo',
      ],
    },
    {
      name: 'Metropolitana',
      communes: [
        'Santiago Centro', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 
        'Pudahuel', 'Recoleta', 'Independencia', 'Cerrillos', 'El Bosque', 'La Pintana', 'Lo Espejo', 
        'Lo Prado', 'Quilicura', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura',
      ],
    },
    {
      name: 'Biobío',
      communes: [
        'Concepción', 'Talcahuano', 'Los Ángeles', 'Chiguayante', 'Coronel', 'Hualpén', 'Lota',
      ],
    },
    {
      name: 'La Araucanía',
      communes: [
        'Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Nueva Imperial', 'Angol', 'Victoria',
      ],
    },
    {
      name: 'Los Lagos',
      communes: [
        'Puerto Montt', 'Puerto Varas', 'Ancud', 'Castro', 'Chaitén', 'Osorno', 'Purranque',
      ],
    },
    {
      name: 'Magallanes',
      communes: [
        'Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos', 'Primavera', 'Timaukel',
      ],
    },
    {
      name: 'Aysén',
      communes: [
        'Coyhaique', 'Puerto Aysén', 'Cisnes', 'Chile Chico', 'Río Ibáñez', 'Lago Verde',
      ],
    },
    {
      name: 'Ñuble',
      communes: ['Chillán', 'Bulnes', 'San Carlos', 'Coihueco', 'Yungay'],
    },
  ];

  availableCommunes: string[] = []; // Lista dinámica de comunas según la región seleccionada

  ngOnInit() {
    this.form.get('rut')?.valueChanges.subscribe((value) => {
      if (!value) return;

      const cleaned = value.replace(/[^0-9kK]/g, ''); // Elimina caracteres no válidos
      if (cleaned.length > 9) {
        const trimmedCleaned = cleaned.slice(0, 9); // Limita a 9 caracteres
        const formattedRut = this.formatRut(trimmedCleaned); // Aplica el formato al RUT limpio
        this.form.get('rut')?.setValue(formattedRut, { emitEvent: false });
        return;
      }
      const formattedRut = this.formatRut(cleaned); // Aplica formato al RUT
      if (formattedRut.length > this.RUT_MAX_LENGTH) {
        this.form.get('rut')?.setValue(formattedRut.slice(0, this.RUT_MAX_LENGTH), { emitEvent: false });
      } else {
        this.form.get('rut')?.setValue(formattedRut, { emitEvent: false });
      }
    });
  }

  // Maneja el cambio de región para filtrar comunas
  onRegionChange(event: any): void {
    const selectedRegion = event.detail.value;

    // Busca las comunas de la región seleccionada
    const regionData = this.regions.find(region => region.name === selectedRegion);

    // Actualiza la lista de comunas disponibles
    this.availableCommunes = regionData ? regionData.communes : [];

    // Limpia la comuna seleccionada si cambia la región
    this.form.controls.location.controls.comuna.setValue('');
  }

  formatRut(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase(); // Elimina caracteres no válidos
    if (cleaned.length <= 1) return cleaned;

    // Dividir en cuerpo y dígito verificador
    const body = cleaned.slice(0, -1);
    const verifier = cleaned.slice(-1);

    // Formatear el cuerpo del RUT con puntos
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBody}-${verifier}`;
  }

  rutValidator(control: FormControl) {
    const value = control.value;
    if (!value) return null;

    // Validación del formato completo del RUT
    const rutRegex = /^\d{1,2}(\.\d{3}){2}-[\dkK]{1}$/; // Formato para RUT válidos
    return rutRegex.test(value) ? null : { invalidRut: true };
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const { email, password, name, lastName, rut, role, contactNumber, location } = this.form.value;

        const userCredential = await this.firebaseSvc.signUp({ email, password });
        const uid = userCredential.user.uid;

        const newUser: User = {
          uid,
          email,
          name,
          lastName,
          rut,
          roles: [role as UserRole],
          contactNumber,
          location,
          profileImageUrl: '',
          createdAt: new Date().toISOString(),
          favorites: [],
          bookings: [],
          servicesOffered: [],
          ratingAverage: 0,
          reviews: [],
        };

        await this.firebaseSvc.setDocument(`users/${uid}`, newUser);
        this.utilsSvc.saveInLocalStorage('user', newUser);

        this.utilsSvc.presentToast({
          message: 'Registro exitoso. Bienvenido!',
          color: 'success',
        });

        this.utilsSvc.routerLink('/home');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.utilsSvc.presentToast({
          message: 'Hubo un error al registrarte. Intenta nuevamente.',
          color: 'danger',
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
