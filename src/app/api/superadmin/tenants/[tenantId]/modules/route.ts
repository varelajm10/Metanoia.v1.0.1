import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

// Aquí va tu lógica para verificar que el usuario es SUPER_ADMIN

const patchBodySchema = z.object({
    enabledModules: z.record(z.boolean()),
});

export async function PATCH(
    req: Request,
    { params }: { params: { tenantId: string } }
) {
    try {
        const { tenantId } = params;
        const body = await req.json();
        const { enabledModules } = patchBodySchema.parse(body);

        await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                enabledModules: enabledModules,
            },
        });

        return new NextResponse(null, { status: 204 }); // 204 No Content for successful update
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
    }
}