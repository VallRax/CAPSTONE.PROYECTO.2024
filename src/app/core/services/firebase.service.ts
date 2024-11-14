import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import { User } from 'src/app/models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  //Autenticar


  getAuth(){
    return getAuth();
  }

  //acceder
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(),user.email, user.password)
  }

  //crear
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password)
  }

  // actualizar usuario
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName})
  }

  // envio de email para restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //Cierre de SESION
signOut(){
  getAuth().signOut();
  localStorage.removeItem('user');
  this.utilsSvc.routerLink('/auth');
}


  //base de datos---------------
  // Setear un documento

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  // obtener un documento
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Método para guardar el rol y otros datos en Firestore
  async setUserData(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Método para obtener los datos completos del usuario, incluyendo el rol
  async getUserData(uid: string): Promise<User | undefined> {
    const docSnap = await getDoc(doc(getFirestore(), `users/${uid}`));
    return docSnap.exists() ? (docSnap.data() as User) : undefined;
  }


}
