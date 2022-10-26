import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="max-w-sm mx-auto p-4">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
