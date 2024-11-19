import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { UtilsService } from './utils.service';
import { User } from 'src/app/models/user.model';
import { Service } from 'src/app/models/service.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  // Métodos de autenticación
  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // Métodos para Firestore
  setDocument(path: string, data: any) {
    try {
      return setDoc(doc(getFirestore(), path), data);
    } catch (error) {
      console.error('Error al guardar el documento:', error);
      throw error;
    }
  }

  async getCollection(path: string): Promise<Service[]> {
    const snapshot = await getDocs(collection(getFirestore(), path));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Service }));
  }

  async deleteDocument(path: string): Promise<void> {
    return deleteDoc(doc(getFirestore(), path));
  }

  createId(): string {
    const db = getFirestore();
    const ref = doc(collection(db, '_')); // `_` es una colección ficticia temporal
    return ref.id;
  }

  async getDocument(path: string) {
    try {
      const docSnap = await getDoc(doc(getFirestore(), path));
      if (docSnap.exists()) {
        return docSnap.data(); // Retorna los datos del documento
      } else {
        console.warn('El documento no existe en la ruta:', path);
        return null; // O lanza un error si prefieres
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      throw error; // Propaga el error
    }
  }
  

}
