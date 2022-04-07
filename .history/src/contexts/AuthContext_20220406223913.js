import React, { useContext } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, serCurrentUser] = useState()

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    auth.onAuthStateChanged(user => {
        serCurrentUser(user)
    })

    const value = {
        currentUser
    }

    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    )
}
