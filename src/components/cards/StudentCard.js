 
import React from "react";
import { FaPhoneAlt, FaWhatsapp, FaEdit } from "react-icons/fa";

const toWhatsAppLink = (phone, prefillMessage) => {
  const digitsOnly = (phone || "").replace(/\D/g, "");

  const withCountryCode =
    digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;

  const base = `https://wa.me/${withCountryCode}`;

  return prefillMessage
    ? `${base}?text=${encodeURIComponent(prefillMessage)}`
    : base;
};

const StudentCard = ({
  name,
  detail,
  image,
  phone,
  whatsappMessage,
  onEdit,
}) => {
  return (
    <div
      className="
        relative overflow-hidden
        bg-white dark:bg-gray-800
        rounded-2xl
        shadow-md hover:shadow-xl
        border border-gray-100 dark:border-gray-700
        p-5 pt-6
        flex flex-col sm:flex-row
        items-center
        gap-4
        w-full
        max-w-md
        transition-all duration-300
        hover:-translate-y-0.5
      "
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand via-sky-400 to-emerald-400" />

      {/* Edit button */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className="
            absolute top-3 right-3
            h-7 w-7
            rounded-full
            bg-gray-50 dark:bg-gray-700
            text-gray-400
            hover:text-brand
            hover:bg-brand/10
            flex items-center justify-center
            transition-colors
          "
        >
          <FaEdit size={12} />
        </button>
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-brand via-sky-400 to-emerald-400 p-[3px]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="
                w-full h-full
                rounded-full
                object-cover
                border-2 border-white dark:border-gray-800
              "
            />
          ) : (
            <div
              className="
                w-full h-full
                rounded-full
                bg-white dark:bg-gray-800
                flex items-center justify-center
                text-brand text-xl font-bold
              "
            >
              {name?.[0] || "?"}
            </div>
          )}
        </div>
      </div>

      {/* Student information */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <h4 className="text-gray-900 dark:text-white font-semibold text-lg truncate">
          {name}
        </h4>

        {detail && (
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
            {detail}
          </p>
        )}

        {/* Contact buttons */}
        <div className="flex justify-center sm:justify-start gap-3 mt-3">
          {phone ? (
            <>
              {/* Call button */}
              <a
                href={`tel:${phone}`}
                title="Call"
                className="
                  h-9 w-9
                  rounded-full
                  bg-blue-50 dark:bg-blue-500/10
                  text-blue-500
                  flex items-center justify-center
                  hover:bg-blue-500 hover:text-white
                  transition-colors
                "
              >
                <FaPhoneAlt size={14} />
              </a>

              {/* WhatsApp button */}
              <a
                href={toWhatsAppLink(phone, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                title="Message on WhatsApp"
                className="
                  h-9 w-9
                  rounded-full
                  bg-emerald-50 dark:bg-emerald-500/10
                  text-emerald-500
                  flex items-center justify-center
                  hover:bg-emerald-500 hover:text-white
                  transition-colors
                "
              >
                <FaWhatsapp size={16} />
              </a>
            </>
          ) : (
            <span className="text-xs text-gray-300">
              No phone on file
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
 