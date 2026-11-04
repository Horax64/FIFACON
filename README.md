# FIFA CON

Sitio privado del equipo organizador, con estética basada en el flyer de la tercera edición (diciembre de 2026).

## Edición sin código

Las cuentas autorizadas ven «Editar página». El panel permite editar portada, descripción, jornadas, actividades, expositores, inscripción, ubicación, contacto y preguntas frecuentes. «Ver página» permite revisar la vista previa; «Guardar cambios» persiste el contenido para todo el equipo. «Salir de edición» pide descartar los cambios si los hay.

Los cambios son compartidos al guardar y se ven al recargar. No hay coedición en vivo. Si dos personas editan una misma versión, el servidor rechaza el segundo guardado y conserva su borrador en pantalla.

## Acceso

La audiencia privada se administra con Sites. La variable de servidor `EDITOR_EMAILS` contiene los correos autorizados a editar, separados por comas; nunca se envía al navegador. Cada editor necesita tanto acceso al sitio como autorización de edición. La identidad viene de ChatGPT y las escrituras se verifican en el servidor. El identificador estable del usuario queda registrado junto al último cambio.

No cambiar la audiencia a pública sin adaptar el texto «Espacio de trabajo del equipo». La edición sigue requiriendo autorización aunque se cambie la audiencia.

## Datos y despliegue

Los contenidos se guardan en D1, tabla `site_content`; el archivo `app/content.ts` contiene solamente los valores iniciales. Desplegar nuevo código no sobrescribe los cambios guardados en la base. El flyer original está en `public/fifa-con-flyer.png`.

El botón de inscripción enlaza un formulario externo HTTPS. No se recopilan inscripciones en esta aplicación.

Se utiliza el starter Vinext de Sites. Seguir su flujo de compilación, migración y despliegue, manteniendo `.openai/hosting.json` y la identidad existente.

## Verificación

- `node tests/content-api.cjs`: autorización, origen, validación de entradas, persistencia y conflictos concurrentes con SQLite aislado y dependencias de identidad simuladas.
- `node node_modules/typescript/bin/tsc --noEmit`: comprobación de tipos.

La configuración local de prueba `.dev.vars` no se versiona ni se publica.
