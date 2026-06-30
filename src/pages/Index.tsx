function Index() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-blue-600">App Encomendas</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Seu app voltou a carregar
          </h1>
          <p className="mt-3 text-base text-slate-600">
            A tela branca foi corrigida com a estrutura principal do React e a rota inicial do sistema.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Status</h2>
            <p className="mt-2 text-slate-600">
              A aplicação já está pronta para receber as próximas telas e integrações.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Próximo passo</h2>
            <p className="mt-2 text-slate-600">
              Agora posso montar login, pedidos, itens, lojas ou o painel principal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Index;