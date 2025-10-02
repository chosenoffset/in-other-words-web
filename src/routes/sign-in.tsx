import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSignIn, useSignUp } from '@clerk/clerk-react'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterClient />
}

function RegisterClient() {
  const navigate = useNavigate()
  const { signIn, isLoaded: isSignInLoaded } = useSignIn()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeSignIn, setActiveSignIn] = useState<unknown>(null)
  const [activeSignUp, setActiveSignUp] = useState<unknown>(null)

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const startEmailFlow = async (address: string) => {
    if (!isSignInLoaded || !isSignUpLoaded) return
    setIsLoading(true)
    setError('')
    setEmail(address)
    setActiveSignIn(null)
    setActiveSignUp(null)
    try {
      try {
        const result = await signIn!.create({
          identifier: address,
          strategy: 'email_code',
        })
        setActiveSignIn(result)
        setShowCodeInput(true)
        setCode(['', '', '', '', '', ''])
        setTimeout(() => inputRefs[0].current?.focus(), 100)
      } catch (err: unknown) {
        const error = err as { errors?: Array<{ code: string }> }
        if (error?.errors?.[0]?.code === 'form_identifier_not_found') {
          const su = await signUp!.create({ emailAddress: address })
          setActiveSignUp(su)
          await su.prepareEmailAddressVerification({ strategy: 'email_code' })
          setShowCodeInput(true)
          setCode(['', '', '', '', '', ''])
          setTimeout(() => inputRefs[0].current?.focus(), 100)
        } else {
          throw err
        }
      }
    } catch (e: unknown) {
      const error = e as Error
      setError(error?.message || 'Failed to start email flow')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      const codeStr = code.join('')
      if (codeStr.length !== 6 || isLoading) return
      setIsLoading(true)
      setError('')
      try {
        if (activeSignIn) {
          const res = await (
            activeSignIn as {
              attemptFirstFactor: (params: {
                strategy: string
                code: string
              }) => Promise<{ status: string }>
            }
          ).attemptFirstFactor({
            strategy: 'email_code',
            code: codeStr,
          })
          if (res.status !== 'complete')
            throw new Error('Verification incomplete')
          navigate({ to: '/sign-in-sso-callback' })
          return
        }
        if (activeSignUp) {
          const res = await (
            activeSignUp as {
              attemptEmailAddressVerification: (params: {
                code: string
              }) => Promise<{ status: string }>
            }
          ).attemptEmailAddressVerification({
            code: codeStr,
          })
          if (res.status !== 'complete')
            throw new Error('Verification incomplete')
          navigate({ to: '/sign-in-sso-callback' })
          return
        }
        throw new Error('No active session')
      } catch (e: unknown) {
        const error = e as Error
        setError(error?.message || 'Failed to verify code')
      } finally {
        setIsLoading(false)
      }
    },
    [code, isLoading, activeSignIn, activeSignUp, navigate]
  )

  useEffect(() => {
    const s = code.join('')
    if (showCodeInput && s.length === 6 && !isLoading) {
      handleCodeSubmit()
    }
  }, [code, showCodeInput, isLoading, handleCodeSubmit])

  const handleOAuth = async (
    provider: 'oauth_google' | 'oauth_facebook' | 'oauth_discord'
  ) => {
    if (!isSignInLoaded || !signIn) return
    setIsLoading(true)
    setError('')
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sign-in-sso-callback',
        redirectUrlComplete: '/sign-in-sso-callback',
      })
    } catch {
      setError('SSO failed, try again')
      setIsLoading(false)
    }
  }

  const onCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      if (value.length === 6 && /^\d+$/.test(value)) {
        setCode(value.split(''))
        inputRefs[5].current?.focus()
        return
      }
      value = value.slice(0, 1)
    }
    if (value && !/^\d+$/.test(value)) return
    const next = [...code]
    next[index] = value
    setCode(next)
    if (value && index < 5) inputRefs[index + 1].current?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const onPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    start: number
  ) => {
    const paste = e.clipboardData.getData('text')
    if (!/^[0-9]{1,6}$/.test(paste)) return
    e.preventDefault()
    const arr = paste.split('')
    setCode(prev => {
      const updated = [...prev]
      for (let i = 0; i < arr.length && start + i < 6; i++) {
        updated[start + i] = arr[i]
      }
      return updated
    })
    setTimeout(() => {
      const lastIdx = Math.min(start + arr.length - 1, 5)
      inputRefs[lastIdx]?.current?.focus()
    }, 0)
  }

  return (
    <main className='h-[calc(100vh-70px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center overflow-auto py-12 px-4'>
      <div className='w-full max-w-[440px]'>
        <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100'>
          Sign in or create an account
        </h1>
        {error && (
          <div className='text-center text-red-600 dark:text-red-400 mb-4'>
            {error}
          </div>
        )}
        {!showCodeInput ? (
          <div className='grid gap-3'>
            <button
              aria-label='Continue with Google'
              onClick={() => handleOAuth('oauth_google')}
              disabled={isLoading}
              className='w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue with Google
            </button>
            <button
              aria-label='Continue with Facebook'
              onClick={() => handleOAuth('oauth_facebook')}
              disabled={isLoading}
              className='w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue with Facebook
            </button>
            <button
              aria-label='Continue with Discord'
              onClick={() => handleOAuth('oauth_discord')}
              disabled={isLoading}
              className='w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue with Discord
            </button>
            <div className='flex items-center gap-2 my-2'>
              <div className='flex-1 h-px bg-gray-300 dark:bg-gray-600' />
              <span className='text-gray-500 dark:text-gray-400 text-sm'>
                or
              </span>
              <div className='flex-1 h-px bg-gray-300 dark:bg-gray-600' />
            </div>
            <form
              onSubmit={e => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                const em = String(fd.get('email') || '').trim()
                if (em) startEmailFlow(em)
              }}
            >
              <input
                name='email'
                type='email'
                placeholder='Email'
                required
                className='w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400'
              />
              <button
                type='submit'
                disabled={isLoading}
                className='w-full mt-3 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleCodeSubmit} className='grid gap-4'>
            <label className='text-center text-gray-700 dark:text-gray-300'>
              Enter the 6-digit code sent to {email}
            </label>
            <div className='flex gap-2 justify-center'>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={code[i]}
                  onChange={e => onCodeChange(i, e.target.value)}
                  onKeyDown={e => onKeyDown(e, i)}
                  onPaste={e => onPaste(e, i)}
                  className='w-11 h-14 text-center text-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
                />
              ))}
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
