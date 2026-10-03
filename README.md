![Victor Roberto Curzio, full-stack developer in La Plata, Argentina: I build management systems that people use every day to work.](assets/banner.png)

[Portfolio](https://viccurzio.github.io/portfolio/) · [LinkedIn](https://www.linkedin.com/in/victor-roberto-curzio/) · [victor.curzio@hotmail.com](mailto:victor.curzio@hotmail.com)

## Where my code runs

**Grupo DELSUD.** Technical reference for a team of five. I designed a plot-sales management system from scratch — Node, TypeScript and Drizzle, twenty modules covering contracts, collections, cash flow and inflation indexing — and integrated it with the CRM already running in production: two databases, two ORMs, bidirectional sync, no downtime. Fifteen people operate it today, over more than 200 contracts.

Now I work on the group's internal ERP: ten repositories, one microservice per department. I built the workday time-tracking module end to end, from the data model to the interface, on an immutable append-only log that no one can edit after the fact. Twenty people across three departments use it. I also took the heaviest queries from 3 seconds down to 0.6 by indexing them.

**2winGs International Group LLC** (freelance). Technical lead of a B2B creative-talent platform. The architecture decisions are mine: NestJS on Fastify, PostgreSQL with Drizzle, Redis queues with BullMQ, a React front on Cloudflare Pages, and the API on a dedicated server under PM2 behind nginx. Deployment runs on GitHub Actions — it builds off the server, applies the migrations and only then restarts. The database is dumped daily to a provider other than the one hosting the server, and restored against a throwaway database, because a backup nobody restored is not a backup.

Both are private repositories. What follows is public.

## What is in here

**[vault-rag](https://github.com/VicCurzio/vault-rag)** — Meaning-based search and a question-answering agent over a folder of markdown notes. 340 notes indexed into 5,338 chunks, hybrid search by meaning and by exact words, embeddings computed on the machine itself so indexing costs nothing and measuring a change is free. The automated evaluation sits at 89% recall and 100% rejection over 34 questions, and it deliberately includes questions whose answer is not in the notes: a green run that was never given anything to reject does not prove the guard is switched on.

**[cv-match](https://github.com/VicCurzio/cv-match)** — A tool to build and adapt a CV to the market it is going to, and to whether a person or an automated filter will read it. Everything runs in the browser, with no server and no database, because a CV carries personal data and has no reason to leave the machine. The PDF is generated as real text instead of an image, so a filter can actually read it. More than 300 tests over the domain.

**[musik](https://github.com/VicCurzio/musik)** — Installable player that reads the music already on the device. No account, no server, no ads, and no file ever leaves the phone. Volume is evened out by measuring each track on import and only attenuating, because amplifying a quiet track digitally distorts it. Tag reading runs on a separate thread and the list paints in blocks, so importing hundreds of files does not freeze the interface.

**[portfolio](https://github.com/VicCurzio/portfolio)** — My own site, in Spanish and English, with an 8-bit console look. The same content file also generates eleven CVs as PDFs, one per kind of role, so a change to my experience never has to be copied by hand into a document.

**[plagas-out](https://github.com/VicCurzio/plagas-out)** — Landing page for a pest control service. The contact form sends real email with no backend of its own, and falls back to the visitor's mail client if the send fails, so a query is never silently lost.

**[bot_whatsapp](https://github.com/VicCurzio/bot_whatsapp)** — Python. Bulk WhatsApp messages from a spreadsheet.

## Stack

TypeScript and Node (NestJS, Fastify, Express), React and Next.js, PostgreSQL and MySQL with Drizzle and Sequelize, Redis with BullMQ, Python and Ruby on Rails.

Docker, nginx, PM2, GitHub Actions, Linux, Cloudflare, Vercel. Playwright and Vitest.

## Studying

Licenciatura en Sistemas at Universidad Nacional de La Plata, alongside a full-time job. What I am after there is the groundwork the day-to-day does not give: algorithms, concurrency, operating systems and databases.
