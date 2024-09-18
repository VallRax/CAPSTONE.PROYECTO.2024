import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);


  //Autenticar


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


  //base de datos---------------
  // Setear un documento

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }




}
