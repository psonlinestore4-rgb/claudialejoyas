// Función debounce para limitar llamadas
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatear moneda
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
}