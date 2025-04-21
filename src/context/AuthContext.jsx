import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Step 1: Try signing up the user via Supabase Auth
  const signUpNewUser = async (fullname, tel, email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          fullname: fullname,
          tel: tel,
        },
      },
    });

    if (authError) {
      console.error("Sign-up error:", authError);
      return { success: false, message: authError.message };
    }

    // Step 2: Call your custom insert_users function
    const { error: rpcError } = await supabase.rpc("insert_users", {
      username: fullname,
      userphone: tel,
      useremail: email,
      userpass: password,
    });

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return { success: false, message: rpcError.message };
    }

    // Everything worked, so return the success response
    return { success: true, data: authData };
  };

  // Sign in function
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Sign-in error occurred:", error);
        return { success: false, error: error.message };
      }

      console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out function
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("There was an error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signOut, signInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
