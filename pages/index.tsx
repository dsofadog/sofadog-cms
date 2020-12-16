// pages/index.jsx
import Head from 'next/head';
import Login from 'features/auth/components/Login';

const Home = () => (
    <div>
        <Head>
            <title>So.Fa.Dog-CMS</title>
            <link rel="icon" href="/color-logo.ico" />
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>

        <Login />

    </div>
)

export default Home
