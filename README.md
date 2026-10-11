<h1 align="center">🏦 Simulador de Home Banking</h1>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

<p align="center">
  <em>Proyecto Final para el curso de JavaScript. Un simulador completo de gestión bancaria con persistencia de datos, asincronismo y manipulación avanzada del DOM.</em>
</p>

---

## 👋 ¡Hola! Soy Ignacio
Este es el repositorio de mi **Proyecto Final**, armando mi portfolio paso a paso. El simulador permite administrar cuentas, ver el patrimonio total del banco, filtrar clientes, registrar cuentas nuevas y realizar transacciones en vivo.
<img width="2525" height="147" alt="Captura" src="https://github.com/user-attachments/assets/587da9f9-b642-4fd6-be88-e3029b151baf" />
<img width="2524" height="729" alt="Captura2" src="https://github.com/user-attachments/assets/138612f2-e134-43fc-a0fa-52780d689bd2" />
<img width="2524" height="1224" alt="Captura3" src="https://github.com/user-attachments/assets/477a9c0f-57eb-4a4a-b504-d8bbd769ab2d" />
*(🖼️ Espacio ideal: Arrastrá y soltá acá una captura de pantalla de tu página web para que se vea en el README)*

## ✨ Novedades de la Versión Final

Para cerrar el curso con todo, integré todas las herramientas vistas y le sumé detalles para que quede más realista:

- 💸 **Operaciones Reales (Modal):** Chau a los `prompt` y `alert` nativos. Armé un modal (pop-up) 100% con DOM para hacer depósitos y extracciones.
- 🌙 **Modo Noche:** Le agregué un botón para cambiar entre tema claro y oscuro. Guarda tu preferencia en el storage para que se acuerde la próxima vez que entres.
- 🧹 **Arquitectura más limpia:** Separé el código en dos archivos (`CuentaBancaria.js` para la clase y `main.js` para la lógica). 
- 🔄 **Restablecer Sistema:** Un botón de emergencia que purga el localStorage y vuelve a cargar los datos originales desde cero.

## ⚙️ Conceptos Técnicos Aplicados

- **Fetch y Async/Await:** Los datos iniciales arrancan desde un archivo `data.json` simulando una API externa.
- **LocalStorage CRUD:** Todo lo que hagas (agregar, borrar, operar) se guarda al instante.
- **Librería Externa:** Integración de **Toastify JS** para notificaciones flotantes y estilizadas.
- **High Order Functions (HOF):** Uso intensivo de `filter`, `map`, `reduce`, `find` y `forEach` para manejar la base de datos y actualizar el DOM en tiempo real.
- **JavaScript Moderno (ES6+):** Aplicación de *destructuring*, operadores ternarios, cortocircuitos lógicos y manejo de errores con `try-catch-finally`.

## 🚀 ¿Cómo hacerlo andar?

Como el proyecto usa `fetch` para traer los datos del JSON al principio, si abrís el archivo `index.html` con doble clic directo te puede llegar a tirar un error de CORS (cosas de seguridad del navegador). 

> **💡 La solución:** Abrí la carpeta del proyecto en **VS Code** y ejecutalo usando la extensión **Live Server**.

---
<p align="center">
  <em>¡Cualquier feedback o sugerencia es súper bienvenido! ✌️</em>
</p>
