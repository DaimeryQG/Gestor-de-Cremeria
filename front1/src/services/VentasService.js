const API_URL = "http://localhost:8081";

export const getProductos = () => {
  return fetch(`${API_URL}/productos`).then(res => res.json());
};

export const getVentas = () => {
  return fetch(`${API_URL}/ventas`).then(res => res.json());
};

export const postVenta = (ventaRequest) => {
  return fetch(`${API_URL}/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ventaRequest)
  }).then(res => {
    if (!res.ok) throw new Error("Error al registrar venta.");
    return res.json();
  });
};

export const getReporteVentas = (inicio, fin) => {
  return fetch(`${API_URL}/reportes/ventas?inicio=${inicio}&fin=${fin}`)
    .then(res => res.json());
};