import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateUser,
  createSession,
  generateAccessToken,
} from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export async function POST(request: NextRequest) {
  console.log("--- INICIO DE PETICIÓN A /api/auth/login ---");
  
  try {
    // Verificar que el request tiene body
    console.log("[LOGIN] Verificando Content-Type...");
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`[LOGIN-ERROR] Content-Type inválido: ${contentType}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'Content-Type debe ser application/json' 
        },
        { status: 400 }
      )
    }
    console.log("[LOGIN] Content-Type válido");

    // Obtener el body de forma segura con validación adicional
    console.log("[LOGIN] Verificando Content-Length...");
    const contentLength = request.headers.get('content-length')
    if (contentLength === '0' || !contentLength) {
      console.error("[LOGIN-ERROR] Request con body vacío");
      return NextResponse.json(
        { 
          success: false,
          error: 'Request body vacío' 
        },
        { status: 400 }
      )
    }
    console.log(`[LOGIN] Content-Length válido: ${contentLength}`);

    // Parsear JSON con logging detallado
    let body
    try {
      console.log("[LOGIN] Iniciando parsing del JSON...");
      body = await request.json()
      console.log(`[LOGIN] JSON parseado exitosamente. Body recibido:`, JSON.stringify(body, null, 2));
      
      // Validar que el body no sea null o undefined
      if (body === null || body === undefined) {
        console.error("[LOGIN-ERROR] Body es null/undefined");
        return NextResponse.json(
          { 
            success: false,
            error: 'Body de la request inválido' 
          },
          { status: 400 }
        )
      }
    } catch (jsonError) {
      console.error("🔥🔥🔥 [LOGIN-CATCH-JSON] Error parsing JSON:", jsonError);
      console.log('Request headers:', Object.fromEntries(request.headers.entries()));
      return NextResponse.json(
        { 
          success: false,
          error: 'JSON inválido en el body de la request',
          details: jsonError instanceof Error ? jsonError.message : 'Error desconocido'
        },
        { status: 400 }
      )
    }

    // Verificar que el body no esté vacío
    if (!body || Object.keys(body).length === 0) {
      console.error("[LOGIN-ERROR] Body vacío después del parsing");
      return NextResponse.json(
        { 
          success: false,
          error: 'Body de la request vacío' 
        },
        { status: 400 }
      )
    }
    console.log("[LOGIN] Body validado correctamente");

    // Validar datos de entrada
    console.log("[LOGIN] Iniciando validación de datos...");
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      console.error(`[LOGIN-ERROR] Validación falló:`, validation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }
    console.log("[LOGIN] Validación de datos exitosa");

    const { email, password } = validation.data
    console.log(`[LOGIN] Intentando login para email: ${email}`);

    // Autenticar usuario
    const user = await authenticateUser(email, password)
    if (!user) {
      console.error(`[LOGIN-ERROR] Usuario no encontrado o credenciales inválidas para: ${email}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'Credenciales inválidas' 
        },
        { status: 401 }
      )
    }
    console.log(`[LOGIN] Usuario autenticado exitosamente: ${user.email} (ID: ${user.id})`);

    // Generar tokens con manejo de errores
    console.log("[LOGIN] Generando access token...");
    let accessToken: string
    let refreshToken: string

    try {
      accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      })
      console.log("[LOGIN] Access token generado exitosamente");
    } catch (tokenError) {
      console.error("🔥🔥🔥 [LOGIN-CATCH-TOKEN] Error generando access token:", tokenError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Error generando token de acceso' 
        },
        { status: 500 }
      )
    }

    try {
      console.log("[LOGIN] Creando sesión de refresh...");
      refreshToken = await createSession(user.id)
      console.log("[LOGIN] Sesión de refresh creada exitosamente");
    } catch (sessionError) {
      console.error("🔥🔥🔥 [LOGIN-CATCH-SESSION] Error creando sesión:", sessionError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Error creando sesión de usuario' 
        },
        { status: 500 }
      )
    }

    // Preparar respuesta
    console.log("[LOGIN] Preparando respuesta de éxito...");
    const authResponse = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: (user as any).tenant,
      },
      token: accessToken,
      refreshToken,
    }

    // Crear respuesta con cookies
    console.log("[LOGIN] Creando NextResponse.json...");
    const response = NextResponse.json(authResponse)

    // Configurar cookies HTTP-only
    console.log("[LOGIN] Configurando cookies...");
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutos
      path: '/',
    })

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/',
    })

    console.log("[LOGIN] ✅ Respuesta de éxito preparada y lista para enviar");
    return response

  } catch (error) {
    // ESTE BLOQUE ES CRÍTICO
    console.error("🔥🔥🔥 [LOGIN-CATCH-GLOBAL] Se ha producido un error inesperado:", error);
    console.error("🔥🔥🔥 [LOGIN-CATCH-GLOBAL] Stack trace:", error instanceof Error ? error.stack : 'No stack trace available');
    
    // Aseguramos que incluso en el peor de los casos, devolvemos un JSON
    const errorResponse = {
      success: false,
      error: 'Error interno del servidor',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { 
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
    
    console.log("[LOGIN] Enviando respuesta de error JSON:", JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    console.log("--- FIN DE PETICIÓN A /api/auth/login ---");
  }
}
