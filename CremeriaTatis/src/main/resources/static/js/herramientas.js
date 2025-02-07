const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", () => {
    sidebar.style.transform = "translateX(0)"; // Muestra el menú
});

closeSidebar.addEventListener("click", () => {
    sidebar.style.transform = "translateX(-100%)"; // Oculta el menú
});