document.addEventListener("DOMContentLoaded", () => {

    /* Manejo del menú desplegable */
    const menuButton = document.getElementById("menuButton");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");
    const menuIcon = document.getElementById("menuIcon");
    const overlay = createOverlay();

    // Función para crear un fondo oscuro al abrir el menú
    function createOverlay() {
        const overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
        overlay.style.display = "none";
        overlay.style.zIndex = "999";
        document.body.appendChild(overlay);
        return overlay;
    }

    if (menuButton && closeSidebar && sidebar) {

        // Abrir menú
        menuButton.addEventListener("click", () => {
            sidebar.style.transform = "translateX(0)";
            overlay.style.display = "block";
            menuIcon.style.display = "none";
        });

        // Cerrar menú
        closeSidebar.addEventListener("click", closeMenu);

        // Cerrar menú si se hace clic fuera del menú
        overlay.addEventListener("click", closeMenu);

        function closeMenu() {
            sidebar.style.transform = "translateX(100%)";
            overlay.style.display = "none";
            menuIcon.style.display = "block";
        }
    }

    /* Carga dinámica del contenido */
    const menuLinks = document.querySelectorAll(".menu-link");
    const dynamicDiv = document.getElementById("DivDinamico");

    // Función para cargar contenido dinámico
    function loadContent(url) {
        if (!dynamicDiv) return;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                dynamicDiv.innerHTML = html;
                closeMenu(); // Cierra el menú después de seleccionar un elemento
            })
            .catch(error => {
                console.error("Error al cargar el contenido:", error);
                dynamicDiv.innerHTML = `
                    <div class="alert alert-danger text-center mt-4">
                        <strong>Error:</strong> No se pudo cargar el contenido. Intenta nuevamente.
                    </div>`;
            });
    }

    // Asignar eventos de clic a los enlaces del menú
    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault(); // Evitar la navegación por defecto
                const target = link.getAttribute("data-target");
                if (target) {
                    loadContent(target); // Cargar el contenido correspondiente
                }
            });
        });
    }

    // Cargar contenido inicial por defecto si el div está vacío
    if (dynamicDiv && dynamicDiv.innerHTML.trim() === "") {
        loadContent("/Usuario/usuario_detalle.html");
    }
});
