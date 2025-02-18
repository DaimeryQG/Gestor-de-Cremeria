document.addEventListener("DOMContentLoaded", () => {
    /* Manejo del menú desplegable */
    const menuButton = document.getElementById("menuButton");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");
    const menuIcon = document.getElementById("menuIcon");

    if (menuButton && closeSidebar && sidebar) {
        menuButton.addEventListener("click", () => {
            sidebar.style.transform = "translateX(0)"; // Mostrar menú
            menuIcon.style.display = "none"; // Esconde los tres puntos
        });

        closeSidebar.addEventListener("click", () => {
            sidebar.style.transform = "translateX(100%)"; // Ocultar menú
            menuIcon.style.display = "block"; // Muestra los tres puntos nuevamente
        });
    }

    /* Carga dinámica del contenido */
    const menuLinks = document.querySelectorAll(".menu-link");
    const dynamicDiv = document.getElementById("DivDinamico");

    // Función para cargar contenido dinámico
    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el archivo: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                dynamicDiv.innerHTML = html;
            })
            .catch(error => {
                console.error("Error al cargar el contenido:", error);
                dynamicDiv.innerHTML = `
                    <div class="text-center text-danger">
                        <p><strong>Error:</strong> No se pudo cargar el contenido. Intenta nuevamente.</p>
                    </div>`;
            });
    }

    // Asignar eventos de clic a los enlaces del menú
    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault(); // Evitar la navegación
                const target = link.getAttribute("data-target"); // Obtener el target
                if (target) {
                    loadContent(target); // Cargar contenido dinámico
                }
            });
        });
    }

    // Cargar contenido inicial por defecto
    loadContent("/Usuario/usuario_detalle.html");
});
