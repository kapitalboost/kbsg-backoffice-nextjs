export { default } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request })

  // console.log('From MiddleWare >> ', session?.password_expired)

  // return NextResponse.redirect(new URL('/reset-password', req.url))
  // console.log(request.nextUrl.pathname)
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/reset-password')) {
    return NextResponse.next()
  } else {
    if (session?.password_expired) {
      // console.log(request.nextUrl.pathname)
      return NextResponse.redirect(new URL('/reset-password', request.url))
    }

    return NextResponse.next()
  }

  //   if (reqApi.url?.includes('reset-password')) {
  //     return NextResponse.next()
  //   }

  //   // if (!reqApi.url?.includes('_next')) {
  //   //   return NextResponse.redirect(new URL('/reset-password', reqApi.url))
  //   // }

  //   // if (!reqApi.url?.includes('api/auth')) {
  //   //   return NextResponse.redirect(new URL('/reset-password', reqApi.url))
  //   // }
  // }
}

export const config = {
  matcher: ['/((?!login|forgot|favicon.ico).*)'],
}
