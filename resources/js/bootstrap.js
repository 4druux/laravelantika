// resources/js/bootstrap.js
import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common["X-CSRF-TOKEN"] = document.head
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
