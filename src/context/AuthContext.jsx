import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up: User
  const signUpNewUser = async (fullname, tel, email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname,
          tel,
        },
      },
    });

    if (authError) {
      console.error("Sign-up error:", authError);
      return { success: false, message: authError.message };
    }

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

    return { success: true, data: authData };
  };

  // Sign up: Organiser
  const signUpNewOrganiser = async (fullname, tel, email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname,
          tel,
        },
      },
    });

    if (authError) {
      console.error("Sign-up error:", authError);
      return { success: false, message: authError.message };
    }

    const { error: rpcError } = await supabase.rpc("insert_organisers", {
      empname: fullname,
      empphone: tel,
      empemail: email,
      emppass: password,
    });

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return { success: false, message: rpcError.message };
    }

    return { success: true, data: authData };
  };

  // Sign in: User
  const signInUser = async (email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Sign-in error:", authError);
      return { success: false, error: authError.message };
    }

    const userid = authData.user.id;

    const { data: userProfile, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("userid", userid)
      .single();

    if (userError || !userProfile) {
      console.error("User not found in users table:", userError);
      return { success: false, error: "User profile not found." };
    }

    return { success: true, data: authData };
  };

  // Sign in: Organiser
  const signInOrganiser = async (email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Sign-in error:", authError);
      return { success: false, error: authError.message };
    }

    const empid = authData.user.id;

    const { data: empProfile, error: empError } = await supabase
      .from("employers")
      .select("*")
      .eq("empid", empid)
      .single();

    if (empError || !empProfile) {
      console.error("Employer not found in employers table:", empError);
      return { success: false, error: "Organiser profile not found." };
    }

    return { success: true, data: authData };
  };

  // Auth state handling
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signUpNewOrganiser,
        signInUser,
        signInOrganiser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
