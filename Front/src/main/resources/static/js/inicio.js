document.addEventListener("DOMContentLoaded", () => {

    /* Manejo del menú desplegable */
    const menuLabel = document.getElementById("menuLabel");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");
    const dynamicDiv = document.getElementById("DivDinamico");
    const overlay = createOverlay();

    // Crear fondo oscuro al abrir el menú
    function createOverlay() {
        let existingOverlay = document.getElementById("overlay");
        if (existingOverlay) return existingOverlay; // Evitar duplicados

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

    if (menuLabel && closeSidebar && sidebar) {

        // Abrir menú
        menuLabel.addEventListener("click", () => {
            sidebar.classList.add("show");
            overlay.style.display = "block";
        });

        // Cerrar menú
        closeSidebar.addEventListener("click", closeMenu);
        overlay.addEventListener("click", closeMenu); // Cerrar menú al hacer clic fuera

        function closeMenu() {
            sidebar.classList.remove("show");
            overlay.style.display = "none";
        }
    }

    /* Carga dinámica del contenido */
    const menuLinks = document.querySelectorAll(".menu-link");

    // Función para cargar contenido dinámico
    function loadContent(url) {
        if (!dynamicDiv) return;

        dynamicDiv.innerHTML = `
            <div class="text-center mt-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>`;

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
                event.preventDefault();
                const target = link.getAttribute("data-target");
                if (target) {
                    loadContent(target);
                }
            });
        });
    }

    // Cargar contenido inicial por defecto si el div está vacío
    if (dynamicDiv && dynamicDiv.innerHTML.trim() === "") {
        loadContent("/view/bienvenido/Bienvenido.html");
    }
});
