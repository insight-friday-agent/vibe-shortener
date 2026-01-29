import Head from "next/head";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { getLinks, ShortLink } from "@/lib/links";

type LinksPageProps = {
  links: ShortLink[];
  rawYaml: string;
};

export default function LinksPage({ links, rawYaml }: LinksPageProps) {
  return (
    <>
      <Head>
        <title>Links cadastrados</title>
      </Head>
      <main className="page">
        <section>
          <h1>Links registrados</h1>
          <p>Use <code>scripts/update_links.py</code> para adicionar ou editar os slugs. Depois é só commitar o YAML.</p>
          <div className="list">
            {links.map((link) => (
              <article key={link.code}>
                <p className="code">{link.code}</p>
                <p>
                  <a href={link.target} target="_blank" rel="noreferrer">
                    {link.target}
                  </a>
                </p>
                <p className="meta">{link.title ?? link.author ?? "Sem título"}</p>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2>Conteúdo do YAML</h2>
          <pre>{rawYaml.trim() || "[]"}</pre>
        </section>
      </main>
      <style jsx>{`
        .page {
          padding: 3rem 1rem;
          max-width: 960px;
          margin: 0 auto;
          font-family: Inter, system-ui, sans-serif;
        }
        h1 {
          margin-bottom: 0.5rem;
        }
        h2 {
          margin-top: 2rem;
        }
        .list {
          display: grid;
          gap: 1rem;
        }
        article {
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
        }
        .code {
          font-weight: 600;
          margin: 0;
        }
        .meta {
          color: #64748b;
          margin: 0.5rem 0 0;
        }
        pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const links = await getLinks();
  const path = join(process.cwd(), "data", "links.yaml");
  let rawYaml = "";
  try {
    rawYaml = await readFile(path, "utf8");
  } catch (err) {
    rawYaml = "";
  }
  return {
    props: {
      links,
      rawYaml,
    },
  };
}
