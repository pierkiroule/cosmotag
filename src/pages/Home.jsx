import { Link } from 'react-router-dom';

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-center text-white">
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-5xl font-bold tracking-tight">coucou</h1>
      <p className="text-lg text-slate-300">
        Préparez-vous à explorer l'expérience HypnoTea et à composer votre infusion poétique.
      </p>
      <Link
        to="/experience"
        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        Entrer dans le jardin onirique
      </Link>
    </div>
  </main>
);

export default Home;
