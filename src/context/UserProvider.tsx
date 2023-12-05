import { decrypt, encrypt } from "@/utils/cryptography"
import { createContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from "react"

export type User = {
    accessToken: string,
    refreshToken: string,
    user_id: number,
    customer_id?: string,
    name: string,
    email: string,
    role: string,
}

export interface UserContextInterface {
    user: User,
    setUser: Dispatch<SetStateAction<User>>
}

export const defaultUserState = {
    user: {
        accessToken: "",
        refreshToken: "",
        user_id: 0,
        customer_id: "",
        name: "",
        email: "",
        role: "",
    },
    setUser: (user: User) => {
        console.log(user);
    }
} as UserContextInterface

export const UserContext = createContext(defaultUserState)


type UserProviderProps = {
    children: ReactNode
}

export default function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User>(defaultUserState.user);

    useEffect(() => {
        if (localStorage.getItem('UserData')) {
            //fetching the encrypted text
            const encryptedText = localStorage.getItem('UserData')

            //decrypt the text
            const decryptedText = decrypt(encryptedText)

            //check if data is valid, if, then save in state
            if (JSON.parse(decryptedText)) {
                const UserData = JSON.parse(decryptedText);
                setUser(UserData);
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('UserData', encrypt(JSON.stringify(user)));
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>

    )
}