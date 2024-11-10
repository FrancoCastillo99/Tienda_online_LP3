# E-commerce de Alimentos 🍔

Este proyecto es una aplicación de e-commerce desarrollada con **React** y **Vite**, que ofrece a los usuarios la posibilidad de comprar una variedad de alimentos como hamburguesas, papas y bebidas. La aplicación utiliza **Firebase** como base de datos para almacenar y gestionar información de productos, usuarios y compras.


## Índice

- [Funcionalidades](#funcionalidades)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Código](#estructura-del-código)


----------

### Funcionalidades

1.  **Página de Cliente**: La página principal de compras donde los usuarios pueden explorar productos, agregarlos al carrito y realizar compras.
2.  **Página de Administrador**: Área destinada a la gestión del e-commerce. Aquí el administrador puede:
    -   Manipular el estado de los usuarios y productos.
    -   Visualizar el balance y estado de cuentas monetarias.

----------

### Arquitectura del Proyecto

El proyecto sigue una estructura **Feature-Based** que permite la escalabilidad y la fácil mantenibilidad del código. Cada funcionalidad está organizada en carpetas separadas dentro de 
/src
│
├── /features                   # Cada funcionalidad tiene su propia carpeta
│   ├── /admin                  # Funcionalidad de administrador
│   │   ├── /assets             # Iconos específicos del administrador
│   │   ├── /components         # Componentes específicos del administrador
│   │   ├── /adminHome          # Página principal del administrador
│   │   ├── /balance            # Balance monetario
│   │   ├── /menu               # Opciones del menú
│   │   ├── /pedidos            # Gestión de pedidos
│   │   ├── /productos          # Gestión de productos
│   │   ├── /usuarios           # Gestión de usuarios
│   │   └── /sideBar            # Barra lateral de navegación para admin
│   │
│   ├── /client                 # Funcionalidad de cliente
│   │   ├── /assets             # Iconos específicos del cliente
│   │   ├── /clientHome         # Página principal del cliente
│   │   ├── /navBar             # Barra de navegación del cliente
│   │   ├── /productSection     # Sección de productos
│   │   ├── /footer             # Pie de página
│   │   └── /sliderSection      # Sección de carrusel para productos destacados
│   │
│   ├── /aboutUs                # Funcionalidad de "Sobre Nosotros"
│   ├── /productCard            # Componente de tarjeta de producto
│   ├── /search                 # Funcionalidad de búsqueda de productos
│   ├── /shoppingCart           # Funcionalidad del carrito de compras
│   ├── /clientProfile          # Perfil de usuario cliente
│   └── /login                  # Funcionalidad de inicio de sesión
│
├── /context                    # Contextos globales para la gestión de estados
├── /config                     # Archivos de configuración (Firebase)
├── App.jsx                     # Componente principal de la aplicación
├── routes.jsx                  # Definición de rutas
├── main.jsx                    # Punto de entrada de la aplicación
└── index.css                   # Estilos globales
 

### Tecnologías Utilizadas

-   **React** + **Vite**: Base para el desarrollo frontend, proporcionando rapidez y eficiencia en el desarrollo de la aplicación.
-   **Firebase**: Base de datos en tiempo real que facilita la gestión de usuarios, productos y datos de compras.
-   **CSS**: Para estilos y diseño responsivo de la interfaz.

----------

### Instalación y Configuración

1.  Clona el repositorio:
    -   `git clone https://github.com/FrancoCastillo99/Tienda_online_LP3.git` 
    
3.  Instala las dependencias:
    -   `npm install` 

4.  Inicia el proyecto en modo de desarrollo:
    -   `npm run dev` 
    

----------

### Estructura del Código

Cada feature incluye sus propios componentes, estilos e iconos necesarios para mantener el código organizado y facilitar la colaboración en el proyecto. Esta estructura ayuda a que el equipo de desarrollo pueda expandir o modificar las funcionalidades sin afectar otras partes del código.