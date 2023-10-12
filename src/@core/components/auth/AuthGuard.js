// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  console.log(router.asPath )
  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      if (router.asPath !== '/apps/calendar/') {
        localStorage.removeItem('refresh')
      } 
      if (router.asPath === '/apps/calendar/') {
        const refresh = window.localStorage.getItem('refresh')
        if (refresh === null) {
          setTimeout(() => {
          window.location.reload()    
          window.localStorage.setItem('refresh', "1")  
          }, 1000) 
        }
      }
      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )
  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
