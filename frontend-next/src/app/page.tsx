import Link from "next/link";

export default function Home() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Controle sua vida financeira em um só lugar
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Organize suas entradas, acompanhe suas saídas e tenha uma visão clara
          da sua situação financeira.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Entrar
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Acessar Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}