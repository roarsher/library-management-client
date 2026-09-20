import React from "react";
import riteshImg from "../../assets/rituatts.jpeg";
import DeveloperCard from "../cards/DeveloperCard";

const developer = {
  name: "Ritesh Kumar",
  role: "Frontend & Backend Developer",
  image: riteshImg,
  email: "riteshmanav2003@gmail.com",
  linkedin: "www.linkedin.com/in/ritesh-3r",
  twitter: "x.com/RiteshManav1",
  whatsapp: "919315634530",
};

const Footer = () => {
  return (
    <footer className="border-t bg-gray-200 dark:bg-gray-900 py-6">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
        <h3 className="text-sm md:text-base text-black dark:text-white tracking-wide mb-4">
          Designed & Developed By
        </h3>

        <div className="w-full flex justify-center">
          <DeveloperCard {...developer} />
        </div>

        <p className="text-xs text-gray-500 mt-5 text-center">
          © 2026 GYAN LIBRARY. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;