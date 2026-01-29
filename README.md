# vibe-shortener (Next.js)

Projeto TypeScript/Next.js que carrega todos os slugs do `data/links.yaml` e entrega redirecionamentos estáticos. Ideal para deploy direto na Vercel, já que os links ficam versionados sob controle.

## Arquitetura

- `data/links.yaml` mantém a lista de slugs, com `code`, `target` e metadados opcionais. O objetivo é editar esse arquivo (via script ou manualmente) e gerar commits com cada novo link.
- `/[code]` é uma rota dinâmica que redireciona para `target` usando `getStaticPaths` + `redirect` no Next.js.
- `/` mostra os links ativos e explica como adicionar novos.
- `/links` apresenta o conteúdo do YAML para validação rápida.
- O script `scripts/update_links.py` cuida da validação e ordenação do YAML; ele replica o fluxo descrito na skill `shortener-links` e depende de `PyYAML` (`pip install pyyaml`).

## Desenvolvimento local

```bash
cd ~/git/vibe-shortener
npm install
npm run dev
```

O servidor roda em `http://localhost:3000`. Teste `http://localhost:3000/sample-link` para ver o redirecionamento em ação.

## Deploy

1. Configure o domínio `shortner.gdantas.com.br` no painel da Vercel e aponte o DNS para a Vercel.
2. Garanta que o `vercel` CLI esteja autenticado (`vercel login` ou usando `--token`).
3. Rode `vercel --prod` para subir o build. O projeto já possui `next.config.js` e `vercel.json` abstratos prontos para o push.
4. Sempre que adicionar links via `scripts/update_links.py`, commit e rode o deploy de novo para atualizar os redirecionamentos.

## Estrutura

```
~/git/vibe-shortener/
├── data/links.yaml          # fonte única dos redirecionamentos
├── lib/links.ts            # helpers para ler o YAML
├── pages/
│   ├── index.tsx           # página inicial explicativa
│   ├── links.tsx           # mostra o conteúdo do YAML
│   └── [code].tsx          # redirecionamentos dinâmicos
├── scripts/                # scripts de manipulação (o principal é update_links.py na skill)
├── package.json
├── tsconfig.json
└── vercel.json
```
```
