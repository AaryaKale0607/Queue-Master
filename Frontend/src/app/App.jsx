
// import React from "react";
// import AppRoutes from "./routes";

// function App() {
//   return <AppRoutes />;
// }

// export default App; 



// import React, { useState, useEffect } from "react";
// import AppRoutes from "../app/routes";
// import SplashScreen from "../components/layouts/SplashScreen";

// function App() {

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   }, []);

//   return (
//     <>
//       {loading ? <SplashScreen /> : <AppRoutes />}
//     </>
//   );
// }

// export default App;

import React, { useState } from "react";
import AppRoutes from "../app/routes";
import SplashScreen from "../components/layouts/SplashScreen";

function App(){

  const [loading,setLoading] = useState(true);

  return (
    <>
      {loading
        ? <SplashScreen finishLoading={() => setLoading(false)} />
        : <AppRoutes />}
    </>
  );
}

export default App;