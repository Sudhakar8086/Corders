// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userData })
        let data = {
          "requestType": "ValidateUser",
          "userId": 9,
          "userName": "gill@gmail.com",
          "userValidation": {
            "status": "Success",
            "message": "User Exists",
            "statusCode": 200,
            "rolesList": [
              {
                "userId": 9,
                "roleName": "Admin",
                "roleId": 1,
                "createdById": 0
              },
              {
                "userId": 9,
                "roleName": "Provider",
                "roleId": 2,
                "createdById": 0
              },
              {
                "userId": 9,
                "roleName": "Dashboard",
                "roleId": 3,
                "createdById": 0
              },
              {
                "userId": 9,
                "roleName": "Dashboard_Advanced_Search",
                "roleId": 4,
                "createdById": 0
              }
            ],
            "permissionList": [
              {
                "userId": 9,
                "permissionId": 1,
                "roleId": 3,
                "roleName": "Dashboard",
                "permissionName": "Dashboard",
                "createdById": 0
              },
              {
                "userId": 9,
                "permissionId": 2,
                "roleId": 2,
                "roleName": "Provider",
                "permissionName": "Provider",
                "createdById": 0
              },
              {
                "userId": 9,
                "permissionId": 3,
                "roleId": 1,
                "roleName": "Admin",
                "permissionName": "Scheduling _access",
                "createdById": 0
              },
              {
                "userId": 9,
                "permissionId": 4,
                "roleId": 1,
                "roleName": "Admin",
                "permissionName": "Leave_approval_access",
                "createdById": 0
              },
              {
                "userId": 9,
                "permissionId": 5,
                "roleId": 4,
                "roleName": "Dashboard_Advanced_Search",
                "permissionName": "Advanced_search",
                "createdById": 0
              }
            ]
          },
          "accessToken": "eyJraWQiOiJFUzZXVmh2dGpDVldTYlRGcjQ2U1ZXS0syS0FIVmJ6NEpreXZCOHM2ZTdjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkZWNmOTMwZS1lOTE2LTQyNmQtYjY4NS0yOTZiOTczNjQzYTEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9vZWRWTDBUaUciLCJjbGllbnRfaWQiOiIxZXJqdGpqMDlvM2lrZzVsa2c3MWl1cmhvdCIsIm9yaWdpbl9qdGkiOiJiODI2ZWFmMi05YzExLTRjYzQtOGQ3Zi1lNjQyYjBhYzIyY2EiLCJldmVudF9pZCI6IjUyNzNkZDFmLThkNTgtNDA0YS05NTMyLTIzZTRhYWJlNzIzZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTUzNjAzMDksImV4cCI6MTY5NTM2MzkwOSwiaWF0IjoxNjk1MzYwMzA5LCJqdGkiOiI4OTA4YWVkNy1hYjY0LTQ5OGEtYjUwZC03NmIwMDJkY2UyY2UiLCJ1c2VybmFtZSI6ImRlY2Y5MzBlLWU5MTYtNDI2ZC1iNjg1LTI5NmI5NzM2NDNhMSJ9.ldT8InWZnpxAcb_faqCkZ8NYaYhc1wH2AHqbHzkJjrsecajK5c9Yw-roIFHiLEHrtA8Cv18zNj_7nd-rzCPGu9Evw711bYwv-BrPXxvtljJcmvMYDRUCv1VcLDcIQS3psNFtOc4khK178FNl5wm8hBLMZ9IW3hCwtUQwVjiOLtJFTFT2QTTwSJjwd4zi2FWaXXDGZxLSHiEHRaDz9Zxq73bFF1uUM6Xef7s81WFwFARum5TBQvW-8TwQz96jMZtkwnPj3WoqmkRfl5zeHxQgRaIqFF1EG8Wb7T8kYigOK-HJph34bvOO6Lttd0FsKtlpnpjXrW58-24EQte8myNfMg",
          "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.stvBOrW20_DS54MPrbirZ8_dXTy4364L508y-j0W7WJbA-LyBAXJup24IYVam_B8ULHMHcAro-Y69vStxpSchOfFPbr0dX8AtsKs9hLnwUQlWBkrCPlwMUnRhtYrpy1PogOoxB_dd81czHhlmoFho25CkkhBG1I4xK2LMe3xcslBnmPLzaNZoDEhgiKDKvJqEfAp3Hx7ISJxkKkKe4qX03nsWZRv_lFsfzxE7_qMoRK_d05d2IExRFdboudYTXc1X-SobO5cEBgPZJNByY1n-wW3D_rgXip9qjYn8bAnmjpeQf011_X8kfKNf92fcYFK_DR-lhigKlOqqULc_khz3Q.ex2IEFo_X_BfmR9g.gCItPeotFFp2hpYs_nPemEG97Y2RLDI99qfJnLEF68YBapevY48muYDDKjkkt_SsnIkHLYmI-Mitc92A0QRfqC80Se_2obhzQeLDrM3qDj_x4MzgNwVLIvykD0xGy_oi7F8zETe-DUzUxRHkP2_xIpLfIguzWi0WXn7_aCIVWUS63DU0uetTPokzktQEAq3OxQ92JLQl34pvQkKTDV8RLu1Su4wpINDPS0q4KTxlWN2qbSIMqRoQCeJauq0m2PBKrrGy8uUwWA0FnkABHgSgxNP19BK-gkUgeL0iHZ2oqFM6LxzlNHI6H02LgbmpVBkEVDRG6df1iQORRHBTPUJ14iLwQwJoqKF3go6Hfcbu7s8re7y07ZCqONuvMOt4dMyz4PwQe2pdd5bLMSL49BIxu4kXxuAreanPltAVP-3qLVxyaBhSgkq12YTZqiYufqQKFD_I5pntrI7OH25td3u0OcsRJmimei4LFhv60B28LyNJw2qAalkF2Pxw77nTsB0d_3MZnfwYSWg-ebWcTzNhXnLdq9_Rb5SBU9XE_K4g1IDc9JOyDApK9UrQ9NlhpDSYU5i8hjb_qrLBwiGIm-sHUZ2AXQXp1OCz9_ojjw-tVPDpTK9Ul5Jrku_qy__m6X2rHr1HGX5YE-xSWCCHJj7nDDshzwcA0HQsi61XncAe1JSILl9X461wqbcvAMRy7EVtJCaxds2m-py2ZchWFUEPZJgmGYL48XCssW2qeM9UaMtecwVF8pM7d0nxypIYMQpfOFzIF_BGYHM2pGvPaTwj7IMRZBXDl5MBsOvLqfZoRDK8UNtD7YU5xnlHD8ra3LFd_kGjVSvgKt5RQRU_sXU-edfS4OhMlD0McZTLi735UGQpLAHD29USHlVhxE7QpTzyquOQn6ojoHLVjfXCNM-6NR-jzFkpaujhx1V9qE8mYOYUTgPlWaB6s8AIxRlwkxrq6M9wBQSc5UVkCFoLdsqz0BkUWzurtOaH0U3wBymp-wScN8kk8Ho0o8u7Tul8rvllBt-LnGA3mo5Ml1zVsK3YYV0J9De6fBFrwah8o7ju67K0NaAjwdbOqpL5lxVhFtxQxZ34Nuny8latJZvwVZZF7yO9UclXyB-3m8Hb9oSYJy-zSxYLGvtqrNbtiXhWmX6GtupQwR5wkRD3pYSdhpsh0xLCnxk1GRsUTTwnvglpcuZT386jAsvZEjpOy45MhCXfoqtduERyAQprsT9yY8XloJoLTH1iFt1aDRmjAnUcM5Ez1fQHg9B4ExtQuzJc_hcobqyjj0Mn90Vz9_VQQt5KMfijuiYKka7pBQMMmpz_6p5nbOms-pnK2ZpZaPw._3o_mc-6c_Z4BhhLpDY4Mg",
          "ability": [
            {
              "action": "manage",
              "subject": "all"
            }
          ],
          "role": "admin"
        }
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(data)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }