
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