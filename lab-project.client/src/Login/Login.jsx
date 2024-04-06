import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-6 bg-black p-6">
          <h1 className="font-semibold text-3xl text-slate-200">Sign In</h1>
          <div className="w-[800px] h-[500px] tb:w-[600px] md:w-[500px] sm:w-[300px] flex items-center p-2 bg-white rounded-xl shadow-2xl">
            <div className="w-full h-full px-2 py-6 flex flex-col items-center justify-between tb:hidden">
              <h2 className="text-3xl font-semibold">Lab Project</h2>
              <p className="w-2/3 text-center text-slate-700 font-medium">Sign In To Our Services E-Commerce App</p>
              <img src="src/assets/img/sign-in.jpg" alt="Sign In to City Services" className="w-4/5"/>
            </div>
            <div className="w-[1px] h-full bg-slate-400 tb:hidden"></div>
            <div className="w-full h-full px-2 py-6 flex flex-col items-center gap-15">
              <h2 className="text-3xl font-semibold">Welcome Back!</h2>
              <form action="" className="w-5/6 flex flex-col gap-6">
                <div className="w-full flex flex-col gap-1">
                  <p className="font-medium">Email</p>
                  <div className="w-full flex justify-between items-center p-4 border-slate-300 rounded-lg border-[1px]">
                    <input type="email" placeholder="Enter your email..." required className="w-full outline-none"/>
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-slate-400"/>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-1">
                  <p className="font-medium">Password</p>
                  <div className="w-full flex justify-between items-center p-4 border-slate-300 rounded-lg border-[1px]">
                    <input type="password" placeholder="Enter your passowrd..." required className="w-full outline-none"/>
                    <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-slate-400"/>
                  </div>
                </div>
                <button type="submit" className="w-full h-12 bg-blue-600 rounded-lg text-slate-100 font-medium hover:text-blue-600 hover:bg-slate-100 duration-150 ease-in">
                  Sign In
                </button>
              </form>
              <p className="text-center text-slate-700 font-medium">Don't have an account? <a href="/sign-up" className="text-blue-600">Sign Up</a></p>
            </div>
          </div>
        </div>
    )
}

export default Login