import { type NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Cek apakah secret token cocok
  if (secret !== process.env.REVALIDATE_TOKEN) {
    return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Path yang ingin di-revalidate (halaman utama)
  const path = '/' 

  try {
    // Revalidate path tersebut
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, now: Date.now(), message: `Path ${path} revalidated` })
  } catch (error) {
    let message = 'Error revalidating';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ revalidated: false, now: Date.now(), message });
  }
}