# Walkthrough: E-Commerce Mobile App MVP 🚀

## Resumen del Logro
Hemos construido de principio a fin un prototipo Mínimo Viable (MVP) para una aplicación móvil de tienda en línea. Este proyecto demuestra dominio sobre arquitecturas **Full-Stack modernas**, separando claramente las responsabilidades del servidor y la interfaz nativa móvil.

## Arquitectura Implementada

### 1. El Backend (NestJS)
- **Tecnologías**: NestJS, TypeScript, Node.js.
- **Rutas Creadas**: `GET /api/products` 
- **Lógica Interna**: Configuración e inicialización del controlador de productos y un servicio con datos inyectables (Mockup Array).
- **Seguridad**: Se habilitó dinámicamente CORS (`app.enableCors()`) permitiendo la transmisión segura y descentralizada de los datos.

### 2. El Frontend (React Native + Expo)
- **Tecnologías**: Expo, React Native, TypeScript.
- **Flujo de Pantallas**:
  - `HomeScreen`: Galería interactiva renderizada con `FlatList` horizontal.
  - `ProductDetailsScreen`: Vista profunda de información con scroll suavizado, insignias personalizadas y precio.
  - `Cart Overlay`: Carro de compras dinámico y modal superpuesto en pantalla.
- **Manejo de Estado**: Se implementó una navegación ultra rápida basada en `useState` puro para cambiar entre vistas al instante, y un algoritmo de sumatoria de carrito para facturar los items virtualmente.
- **Integración Asíncrona**: Consumo directo mediante la API de `fetch(...)` cargando un estado de `ActivityIndicator` (rueda de carga) mientras resuelve las peticiones hacia el puerto 3000 de NestJS. 
- **Modo PC Simulator**: Componentes estilizados condicionalmente (`Platform.OS === 'web'`) para dibujar un falso dispositivo iPhone en pantalla y facilitar grabaciones desde un computador.

## Estado de Pruebas
✔️ La interfaz compila sin errores.\
✔️ La conexión Backend <-> Frontend transfiere JSON correctamente.\
✔️ El ciclo de compra (Anexar item -> Sumar -> Finalizar Pago -> Vaciar Carrito) opera con validación funcional.

## Siguientes Pasos (Para el Usuario)
1. Abrir la herramienta Recortes (Windows) y tomar capturas de la tienda.
2. Hacer un pequeño video o GIF de la navegación del estado de carrito.
3. Subir todos estos archivos como `README.md` junto con los dos folders (`ecommerce-mobile` y `ecommerce-backend`) a GitHub.
4. Anexar el link del GitHub terminado dentro de tu Portafolio Principal y presentarlo a los reclutadores.
