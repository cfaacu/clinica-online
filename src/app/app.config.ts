import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"clinica-especialista-c2249","appId":"1:976905366152:web:20de079495a386a022cd3d","storageBucket":"clinica-especialista-c2249.firebasestorage.app","apiKey":"AIzaSyDJGCagdN6PtL1b0x56JydPThHSk39-vIA","authDomain":"clinica-especialista-c2249.firebaseapp.com","messagingSenderId":"976905366152"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),provideStorage(() => getStorage(), provideAnimations())
  ]
};
