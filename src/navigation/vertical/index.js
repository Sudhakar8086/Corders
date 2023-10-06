const navigation = () => {
  return [
    {
      title: 'Calendar',
      icon: 'tabler:calendar',
      path: '/apps/calendar'
    },
    {
      title: 'Schedule',
      icon: 'tabler:users',
      path: '/apps/schedule'
    },
    {
        title: 'Leave Check',
        icon: 'tabler:eye',
        path: '/apps/ui_leave'
    },
    {
      title: 'Documents',
      icon: 'tabler:table',
      path: '/storage/documents'
    },
    {
      title: 'Change Password',
      icon: 'tabler:password-user',
      path: '/apps/change_password'
    },
    {
      title: 'New Password',
      icon: 'tabler:shield-lock-filled',
      path: '/apps/new-password'
    },
    {
      title: 'Forgot Password',
      icon: 'tabler:lock',
      path: '/apps/forgot_password'
    }
  ]
}

export default navigation
