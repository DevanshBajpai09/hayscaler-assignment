import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff,
  Building2,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function Login() {

  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [serverError,setServerError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const login = async () => {

    if (!email || !password) return;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try{

      setIsLoading(true);
      setServerError("");

      const res = await fetch(`${BACKEND_URL}/api/auth/login`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json();

      if(!res.ok){
        setServerError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // save user info
      localStorage.setItem("user", JSON.stringify(data));

      // redirect based on role
      if(data.role === "MANAGER"){
        navigate("/manager");
      }else{
        navigate("/dashboard");
      }

    }catch(error){

      setServerError("Server not reachable");
      console.log(error)

    }

    setIsLoading(false);

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">

      <div className="w-full max-w-md">

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Building2 size={32} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>

            <p className="text-gray-600">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />

              </div>

              {emailError && (
                <p className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>

              </div>

            </div>

            {/* Server Error */}
            {serverError && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={16}/>
                {serverError}
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={login}
              disabled={isLoading || !email || !password}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white"
            >

              {isLoading ? "Signing in..." : (
                <>
                  <LogIn size={18}/>
                  Sign In
                </>
              )}

            </button>

            {/* Demo Info */}
            <div className="text-xs text-center text-gray-500 mt-3">
            <Link to="/">
              <button className="text-indigo-600 hover:text-indigo-800">
                Back to Home
              </button>
            </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}