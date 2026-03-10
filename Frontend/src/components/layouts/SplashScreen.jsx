// import React, { useEffect, useState } from "react";
// import "../styles/SplashScreen.scss";

// const SplashScreen = ({ finishLoading }) => {

//   const [fadeOut, setFadeOut] = useState(false);

//   useEffect(() => {

//     const timer = setTimeout(() => {
//       setFadeOut(true);

//       setTimeout(() => {
//         finishLoading();
//       }, 500);

//     }, 1600);

//     return () => clearTimeout(timer);

//   }, [finishLoading]);

//   return (
//     <div className={`splash ${fadeOut ? "fade-out" : ""}`}>

//       <div className="splash-center">

//         <div className="logo-wrapper">
//           <img src="/Q.png" alt="QueueMaster Logo"/>
//         </div>

//       </div>

//       <div className="splash-footer">
//         <p>from</p>
//         <span>QueueMaster</span>
//       </div>

//     </div>
//   );
// };

// export default SplashScreen;







import React, { useEffect } from "react";
import "../styles/SplashScreen.scss";

const SplashScreen = ({ finishLoading }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 1500);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <div className="splash">

      <div className="splash-center">
        <div className="logo-wrapper">
          <img src="/Q.png" alt="QueueMaster Logo" />
        </div>
      </div>

      <div className="splash-footer">
        <p>from</p>
        <span>QueueMaster</span>
      </div>

    </div>
  );
};

export default SplashScreen;