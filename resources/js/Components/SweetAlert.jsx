import PropTypes from "prop-types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SweetAlert = ({ title, message, icon, showCancel = true }) => {
  return new Promise((resolve) => {
    if (title && message && icon) {
      MySwal.fire({
        title: `<span class="text-xl font-semibold text-gray-700">${title}</span>`,
        html: `<p class="text-base text-gray-600 mt-2">${message}</p>`,
        icon,
        showCancelButton: showCancel,
        confirmButtonText: "Oke",
        cancelButtonText: "Batal",
        buttonsStyling: false,
        reverseButtons: false,
        customClass: {
          popup: "bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto",
          actions: showCancel
            ? "flex justify-end space-x-4 mt-6"
            : "flex justify-end mt-6",
          cancelButton: showCancel
            ? [
                "px-6 py-3",
                "border border-teal-500",
                "text-teal-500 text-sm font-semibold",
                "rounded-full",
                "hover:bg-teal-500 hover:text-white transition-colors",
                "disabled:bg-gray-300 disabled:cursor-not-allowed",
              ].join(" ")
            : null,
          confirmButton: [
            "px-6 py-3",
            "bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400",
            "text-white text-sm font-semibold",
            "rounded-full",
            "hover:bg-none hover:bg-teal-500",
            "disabled:bg-none disabled:bg-gray-300 disabled:cursor-not-allowed",
          ].join(" "),
        },
        backdrop: true,
        showClass: { popup: "animate__animated animate__fadeInDown" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
        allowOutsideClick: true,
        width: "auto",
      }).then((result) => {
        resolve(result.isConfirmed);
      });
    } else {
      resolve(false);
    }
  });
};

SweetAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(["success", "error", "warning", "info", "question"])
    .isRequired,
  showCancel: PropTypes.bool,
};

export default SweetAlert;
