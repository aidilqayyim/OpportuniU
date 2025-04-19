import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined);

    // Sign up function
    const signUpNewUser = async (fullname, tel, email, password) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
            data: {
                fullname: fullname,
                tel: tel
            }
        }
        });

        if(error) {
            console.error("There was a problem signing up:", error);
            return {success: false, error};
        }
        return { success: true, data};
    };

    // Sign in
    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if(error) {
                console.error("sign in error occured: ", error);
                return {success: false, error:error.message};
            }

            console.log("sign-in success: ", data);
            return {success: true, data};
        } catch(error) {
            console.error("an error occured: ", error)
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    // sign out functions
    const signOut = () => {
        const { error } = supabase.auth.signOut();
        if (error) {
            console.error("There was an error: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signOut, signInUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}