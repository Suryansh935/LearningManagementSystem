import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
     <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="w-16 h-16 border-4 border-gray-300 
    border-t-blue-600 rounded-full animate-spin"></div>
  </div>
  );
};

export default Loading;