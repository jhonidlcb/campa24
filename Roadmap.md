# Roadmap de Desarrollo - Plataforma Electoral Carlos Antonio López

Este documento detalla las funcionalidades planeadas para convertir esta web en una herramienta política indispensable para los candidatos de la región.

## 🎯 Objetivo
Ofrecer una solución tecnológica "llave en mano" que permita a los candidatos gestionar su presencia digital, captar voluntarios y comunicar propuestas de manera profesional.

---

## 🛠️ Tareas Pendientes y Nuevas Funcionalidades

### 1. Panel de Administración Avanzado (Prioridad Alta)
Actualmente existe un `/admin` básico. Necesitamos potenciarlo:
- [x] **Gestión de Noticias/Blog:** Crear, editar y eliminar comunicados de prensa o crónicas de recorridos. (Implementado)
- [x] **Dashboard de Simpatizantes:** Visualizar la lista de personas registradas, con opción de exportar a Excel. (Implementado)
- [x] **Gestor de Propuestas:** Una sección dedicada para subir el "Plan de Gobierno" segmentado por áreas. (Implementado)
- [x] **Selector de Estilo en Tiempo Real:** Botón en el admin para previsualizar diferentes identidades políticas. (Implementado)
- [ ] **Control de Galería:** Poder subir fotos de los encuentros directamente desde el celular (Integración con Cloudinary o S3).
- [ ] **Gestión de Eventos:** Calendario de actividades con sistema de confirmación de asistencia (RSVP).

### 2. Experiencia de Usuario (Frontend)
- [x] **Detalle de Propuestas:** El "Leer más" ahora abre un modal con el plan de acción detallado. (Implementado)
- [ ] **Persistencia de Identidad:** Guardar la preferencia de color/estilo en la base de datos para que sea la identidad oficial del sitio.
- [ ] **Modo Offline (PWA):** Instalación como app y caché de propuestas para consulta en zonas sin señal.
- [ ] **Generador de Flyers:** Herramienta para crear imágenes de campaña personalizadas (Nombre + Foto del candidato + Propuesta).

### 3. Funcionalidades de Territorio (Específico de Carlos A. López)
- [ ] **Geolocalización de Simpatizantes:** Visualización en mapa (Heatmap) de la base de datos de simpatizantes por barrio.
- [x] **Botón de WhatsApp Directo:** Enlace al comando de campaña. (Implementado)
- [ ] **Encuestas de Barrio:** Formularios rápidos para relevar necesidades específicas por zona y generar reportes automáticos.

### 4. Comunicación y Marketing
- [ ] **Integración WhatsApp API:** Envío automático de mensaje de bienvenida y propuesta en PDF a nuevos registrados.
- [ ] **SEO Local Avanzado:** Configuración de Meta Tags dinámicos para que cada noticia y propuesta se comparta con imagen y título optimizado.

### 5. Seguridad y Estabilidad
- [x] **Sistema de Login para Admin:** Protección del panel. (Implementado)
- [ ] **Restricción de Registro:** Desactivar la creación de nuevos usuarios admin una vez configurado el sitio principal.
- [ ] **Logs de Actividad:** Registro de quién modificó qué contenido en el panel de administración.

---

## 🚀 Ideas para "Cerrar la Venta"
Para que un político *necesite* esta web, debemos ofrecerle:
1. **Base de Datos Propia:** "No dependas de Facebook, ten tu propia lista de contactos con nombre y barrio".
2. **Profesionalismo:** "Tus propuestas se ven mejor en una web oficial que en una imagen de WhatsApp".
3. **Transparencia:** "Muestra tus actividades diarias para generar confianza en el electorado".

---
*Documento actualizado por Replit Agent - Feb 2026*
