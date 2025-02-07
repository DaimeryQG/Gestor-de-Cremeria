/*Para el menu desplegable*/
const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", () => {
    sidebar.style.transform = "translateX(0)"; // Muestra el menú
});

closeSidebar.addEventListener("click", () => {
    sidebar.style.transform = "translateX(-100%)"; // Oculta el menú
});
/*Para la carga dinamica del contenido*/
// Seleccionar enlaces del menú y el div dinámico
const menuLinks = document.querySelectorAll(".menu-link");
const dynamicDiv = document.getElementById("DivDinamico");

// Función para cargar contenido dinámico
function loadContent(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Actualizar contenido del div dinámico
            dynamicDiv.innerHTML = html;
        })
        .catch(error => {
            console.error("Error:", error);
            dynamicDiv.innerHTML = `<div class="text-center text-danger">
                <p>Error al cargar el contenido. Intenta nuevamente.</p>
            </div>`;
        });
}

// Asignar eventos de clic a los enlaces del menú
menuLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        const target = link.getAttribute("data-target");
        loadContent(target); // Cargar el archivo objetivo
    });
});

// Cargar contenido inicial por defecto
loadContent("../../templates/view/bienvenido/Bienvenido.html");

