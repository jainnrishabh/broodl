'use client';
import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '@/firebase';
import { getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}


export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [userDataObject, setUserDataObject] = useState(null);
    const [loading, setLoading] = useState(true);

    //AUTH HANDLERS
    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        setUserDataObject(null);
        setCurrentUser(null);
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try{
                // set user to local context state
                setLoading(true);
                setCurrentUser(user);
                if(!user){
                    console.log("No user found")
                    return
                }
                console.log("Fetching user data")
                // get user data from firestore
                const docREF = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docREF);

                let firebaseData = {}

                if(docSnap.exists()){
                    console.log("found user data")
                    firebaseData = docSnap.data();
                    console.log(firebaseData);
                }
                setUserDataObject(firebaseData);    
            }catch(err){
                console.log(err.message);
            }finally{
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userDataObject,
        setUserDataObject,
        signup,
        login,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}