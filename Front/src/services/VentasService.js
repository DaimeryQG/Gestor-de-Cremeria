export const getProductos = () => {
  return fetch('/productos').then(res => res.json());
};

export const getVentas = () => {
  return fetch('/ventas').then(res => res.json());
};

export const postVenta = (ventaRequest) => {
  return fetch('/ventas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ventaRequest)
  }).then(res => {
    if (!res.ok) throw new Error('Error al registrar venta.');
    return res.json();
  });
};

export const getReporteVentas = (inicio, fin) => {
  return fetch(`/reportes/ventas?inicio=${inicio}&fin=${fin}`).then(res => res.json());
};
