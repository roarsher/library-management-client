 

// import React from "react";
// // import { FcGoogle } from "react-icons/fc";  

// // import { toast } from "react-hot-toast";

// import { FaEnvelope, FaLinkedin, FaTwitter } from "react-icons/fa";

// const DeveloperCard = ({ name, role, image, email, linkedin, twitter }) => {
//   return (
//     // <div className="bg-white border border-white  rounded-xl p-4 flex gap-4 items-center">
//     <div className="border-t bg-gray-200 dark:bg-gray-900/50 py-6 flex gap-4 items centre" >
      
//       <img
//         src={image}
//         alt={name}
//         className="w-14 h-14 rounded-full object-cover border border-black"
//       />

//       <div className="flex-1">
//         <h4 className="text-black font-semibold">{name}</h4>
//         <p className="text-richblack-300 text-xs">{role}</p>

//         <div className="flex gap-3 mt-2 text-lg">
//           <a href={`mailto:${email}`} className="hover:text-yellow-50">
//             <FaEnvelope />
//           </a>
//           <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-yellow-50">
//             <FaLinkedin />
//           </a>
//           <a href={twitter} target="_blank" rel="noreferrer" className="hover:text-yellow-50">
//             <FaTwitter />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeveloperCard;
import React from "react";
import { FaEnvelope, FaLinkedin, FaTwitter } from "react-icons/fa";

const DeveloperCard = ({
  name,
  role,
  image,
  email,
  linkedin,
  twitter,
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
          <a
            href={`mailto:${email}`}
            className="text-gray-600 hover:text-blue-500"
          >
            <FaEnvelope />
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-blue-700"
          >
            <FaLinkedin />
          </a>

          <a
            href={twitter}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-sky-500"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;