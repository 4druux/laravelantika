import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";

const AppFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="bg-white mt-14 xl:mt-20"
      style={{ boxShadow: "0px -5px 10px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="container mx-auto flex flex-col xl:flex-row items-start justify-between px-4 gap-4 xl:gap-10 py-10 text-sm">
        <div className="lg:w-3/4">
          <img
            src="/images/logo.png"
            alt="Antika Studio logo"
            className="cursor-pointer w-[180px] md:w-[200px] h-auto"
          />
          <div className="flex items-center space-x-3 my-3">
            <a
              href="https://api.whatsapp.com/send/?phone=%2B62895332188227&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-6 h-6 text-green-500 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer" />
            </a>
            <a
              href="https://www.tiktok.com/@antika.selfphotostudio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillTikTok className="w-6 h-6 text-[#262626] hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer" />
            </a>
            <a
              href="https://www.instagram.com/antika.selfphotostudio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-6 h-6 text-[#E4405F] hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer" />
            </a>
          </div>
          <p className="w-full text-base text-gray-600">
            Setiap momen punya cerita. Antika Studio hadir untuk membantu Anda
            mengabadikan tiap detiknya dengan penuh kesan.
          </p>
        </div>

        <div className="lg:w-1/4">
          <p className="text-base font-medium mb-2 lg:mb-4 text-gray-800">
            Jelajahi Kami
          </p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <a
              href="#about"
              onClick={scrollToTop}
              className="hover:text-teal-600 cursor-pointer text-base underline"
            >
              <li>About</li>
            </a>
            <a
              href="#gallery"
              onClick={scrollToTop}
              className="hover:text-teal-600 cursor-pointer text-base underline"
            >
              <li>Gallery</li>
            </a>
            <a
              href="#schedule"
              onClick={scrollToTop}
              className="hover:text-teal-600 cursor-pointer text-base underline"
            >
              <li>Schedule</li>
            </a>
          </ul>
        </div>

        <div className="lg:w-1/4">
          <p className="text-base font-medium mb-2 lg:mb-4 text-gray-800">
            Hubungi Kami
          </p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="hover:text-teal-600 cursor-pointer text-base underline">
              <a
                href="https://api.whatsapp.com/send/?phone=%2B62895332188227&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                +62895-3321-88227
              </a>
            </li>
            <li className="hover:text-teal-600 cursor-pointer text-base underline">
              <a
                href="mailto:fotoStudio@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                fotoStudio@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:w-1/4">
          <p className="text-base font-medium mb-2 lg:mb-4 text-gray-800">
            Alamat Kami
          </p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.8772502673905!2d106.71141039999999!3d-6.409809300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e7645e98d333%3A0x10487d6f34c95eb6!2sAntika%20Studio!5e0!3m2!1sid!2sid!4v1751797450076!5m2!1sid!2sid"
              width="300"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Antika Studio Location"
            ></iframe>
          </ul>
        </div>
      </div>

      <div className="container mx-auto">
        <p className="border-t border-gray-300" />
        <div className="py-5 text-sm text-gray-600 flex justify-center">
          <p> Hak Cipta © {new Date().getFullYear()} Antika Studio.</p>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
