import Head from "next/head";
import Link from "next/link";

import { getLinks, ShortLink } from "@/lib/links";

type HomeProps = {
  links: ShortLink[];
};

export default function Home({ links }: HomeProps) {
  return (
    <>
      <Head>
        <title>vibe-shortener</title>
        <meta
          name="description"
          content="Redirect layer that maps slugs to targets stored in data/links.yaml"
        />
      </Head>
      <main className="layout">
        <section className="panel">
          <p className="eyebrow">vibe-shortener</p>
          <h1>Links versionados por YAML</h1>
          <p>
            Cada slug é definido dentro de <code>data/links.yaml</code> e, quando acessado, o Next.js lê o arquivo e
            redireciona para o destino configurado.
          </p>
          <p>
            Para adicionar um link basta editar o arquivo manualmente ou rodar o script{' '}
            <code>scripts/update_links.py</code>; tudo é versionado e refeito no próximo deploy.
          </p>
        </section>

        <section className="panel">
          <header className="section-header">
            <h2>Links ativos</h2>
            <Link href="/links">Ver arquivo completo →</Link>
          </header>
          {links.length === 0 ? (
            <p>Nenhum link registrado. Use o script para adicionar o primeiro.</p>
          ) : (
            <div className="link-list">
              {links.map((link) => (
                <article key={link.code} className="link-card">
                  <div>
                    <p className="code">{link.code}</p>
                    <p className="target">
                      <a href={link.target} target="_blank" rel="noreferrer">
                        {link.target}
                      </a>
                    </p>
                  </div>
                  <p className="meta">{link.title ?? link.author ?? "Sem título"}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <style jsx>{`
        .layout {
          min-height: 100vh;
          padding: 4rem 1rem;
          background: linear-gradient(135deg, #050816, #0d1117 55%, #111827 100%);
          color: white;
          font-family: Inter, system-ui, sans-serif;
        }
        .panel {
          max-width: 960px;
          margin: 0 auto 2rem auto;
          padding: 2rem;
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 40px rgba(2, 6, 23, 0.4);
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.5em;
          font-size: 0.75rem;
          color: #94a3b8;
        }
        h1 {
          font-size: 2.25rem;
          margin: 0.5rem 0 1rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .section-header a {
          color: #7dd3fc;
          text-decoration: none;
        }
        .link-list {
          margin-top: 1.5rem;
          display: grid;
          gap: 1rem;
        }
        .link-card {
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .code {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .target a {
          color: #38bdf8;
        }
        .meta {
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
          color: #94a3b8;
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const links = await getLinks();
  return {
    props: {
      links,
    },
  };
}
