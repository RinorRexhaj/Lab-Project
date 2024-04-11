import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const Login = ({session, setSession, login, toggleLogin}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [retypeError, setRetypeError] = useState("");
  const navigate = useNavigate();

  const handleErrors = (e) => {
    const { name, value } = e.target;

    if(value.length != 0) setPasswordError("");

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(name === "fullName") {
      if(/^[A-Za-z\s]*$/.test(value))
        setNameError("");
      else setNameError("Wrong Format!");
    }
    else if (name === "email") {
      if(emailRegex.test(value))
        setEmailError("");
      else setEmailError("Wrong Format!");
    } else if(name === "password") {
      if(value.length < 8)
        setPasswordError("Password >= 8 characters!");
      else if(!/\d/.test(value)) 
        setPasswordError("Password needs to contain numbers!");
      else 
        setPasswordError("");
    } else if(name === "retype") {
      if(formData.password !== value)
        setRetypeError("Passwords don't match!");
      else 
        setRetypeError("");
    }

    setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData.email.length);
    if((emailError === "" && passwordError === "") && (formData.email.length != 0 && formData.password.length != 0)) {
      setTimeout(() =>  {
        setSession(true);
        navigate("/");
      }, 1000);
      console.log(formData);
    }
    else if(formData.email.length == 0 || formData.password.length == 0 || formData.name.length == 0 || formData.retype.length == 0) {
      if(login) setPasswordError("Empty Inputs!");
      else setRetypeError("Empty Inputs!");
    }
  }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-6 bg-black p-6">
          <h1 className="font-semibold text-3xl text-slate-200">Sign {login ? 'In' : 'Up'}</h1>
          <div className="w-[800px] h-[500px] tb:w-[600px] md:w-[500px] sm:w-[300px] flex items-center p-2 bg-white rounded-xl shadow-2xl">
            <div className="w-full h-full px-2 py-6 flex flex-col items-center justify-between tb:hidden">
              <h2 className="text-3xl font-semibold">Lab Project</h2>
              <p className="w-2/3 text-center text-slate-700 font-medium">Sign {login ? 'In' : 'Up'} To Our Services <br></br> E-Commerce App</p>
              <img src="src/assets/img/sign-in.jpg" alt="Sign In to City Services" className="w-4/5"/>
            </div>
            <div className="w-[1px] h-full bg-slate-400 tb:hidden"></div>
            <div className="w-full h-full px-2 py-6 flex flex-col items-center gap-15">
              {login && <h2 className="text-3xl font-semibold">Welcome Back!</h2>}
              <form action="" className="w-5/6 flex flex-col gap-6" onSubmit={handleSubmit}>
                {!login && <div className="w-full flex flex-col relative gap-1">
                  <p className="font-medium">Full Name</p>
                  <div className="w-full flex justify-between items-center px-4 py-3 border-slate-300 rounded-lg border-[1px]">
                    <input type="text" name="fullName" placeholder="Enter your full name..." className="w-full outline-none"
                    onChange={handleErrors}
                    required/>
                    <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-slate-400"/>
                  </div>
                  <div className="h-0 absolute bottom-0 text-red-500 font-medium text-md">{nameError}</div>
                </div>}
                <div className="w-full flex flex-col relative gap-1">
                  <p className="font-medium">Email</p>
                  <div className="w-full flex justify-between items-center px-4 py-3 border-slate-300 rounded-lg border-[1px]">
                    <input type="email" name="email" placeholder="Enter your email..." required className="w-full outline-none"
                    onChange={handleErrors}/>
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-slate-400"/>
                  </div>
                  <div className="h-0 absolute bottom-0 text-red-500 font-medium text-md">{emailError}</div>
                </div>
                <div className="w-full flex flex-col relative gap-1">
                  <p className="font-medium">Password</p>
                  <div className="w-full flex justify-between items-center px-4 py-3 border-slate-300 rounded-lg border-[1px]">
                    <input type="password" name="password" placeholder="Enter your password..." required className="w-full outline-none"
                    onChange={handleErrors}/>
                    <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-slate-400"/>
                  </div>
                  <div className="h-0 absolute bottom-0 text-red-500 font-medium text-md">{passwordError}</div>
                </div>
                {!login && <div className="w-full flex flex-col relative gap-1">
                  <p className="font-medium">Re-type Password</p>
                  <div className="w-full flex justify-between items-center px-4 py-3 border-slate-300 rounded-lg border-[1px]">
                    <input type="password" name="retype" placeholder="Re-Enter your password..." required className="w-full outline-none"
                    onChange={handleErrors}/>
                    <FontAwesomeIcon icon={faKey} className="w-5 h-5 text-slate-400"/>
                  </div>
                  <div className="h-0 absolute bottom-0 text-red-500 font-medium text-md">{retypeError}</div>
                </div>}
                <button type="submit" className="w-full h-12 bg-blue-600 rounded-lg text-slate-100 font-medium hover:text-blue-600 hover:bg-slate-100 duration-150 ease-in" onClick={handleSubmit}>
                  Sign {login ? 'In' : 'Up'}
                </button>
              </form>
              <p className={`text-center font-medium ${login ? ' text-slate-700' : 'relative bottom-8 text-slate-200'}`}>{login ? `Don't have an account?` : `Already have an account?`} <span className="text-blue-600 cursor-pointer" onClick={() => toggleLogin()}>Sign {login ? 'Up' : 'In'}</span></p>
            </div>
          </div>
        </div>
    )
}

export default Login