 
import React from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const DeveloperCard = ({
  name,
  role,
  image,
  email,
  linkedin,
  twitter,
  whatsapp,
}) => {
  return (
    <div
      className="
        bg-white dark:bg-gray-800
        rounded-xl
        shadow-md
        p-4
        flex flex-col sm:flex-row
        items-center
        gap-4
        w-full
        max-w-md
      "
    >
      <img
        src={image}
        alt={name}
        className="
          w-16 h-16
          rounded-full
          object-cover
          border-2 border-gray-300
        "
      />

      <div className="flex-1 text-center sm:text-left">
        <h4 className="text-black dark:text-white font-semibold text-lg">
          {name}
        </h4>

        <p className="text-gray-500 text-sm">
          {role}
        </p>

        <div className="flex justify-center sm:justify-start gap-4 mt-3 text-lg">
          
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="text-gray-600 hover:text-blue-500"
            title="Email"
          >
            <FaEnvelope />
          </a>

          {/* LinkedIn */}
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-blue-700"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>

          {/* Twitter */}
          <a
            href={twitter}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-sky-500"
            title="Twitter"
          >
            <FaTwitter />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-green-500"
            title="WhatsApp"
          >
            <FaWhatsapp />
          </a>

        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
 
 
