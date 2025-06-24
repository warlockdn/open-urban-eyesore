# Open Urban Eyesore

> An open, community‑driven platform for documenting the state of public infrastructure — starting with potholes eventually extending to other civic infrastructure and civic domains (blocked roads, footpaths, waste dumps, etc.).

---

## 🌟 Introduction

Open Urban Eyesore is an open‑source initiative built to **enable communities to openly record, review, and map instances of urban infrastructure issues**. The project aims to foster accountability, transparency, and collaboration between citizens and authorities.

Initially focusing on potholes and eventuall extending to other civic issues, it provides tools and patterns for:

* 📷 Uploading geo‑tagged images
* 👥 Community review and moderation
* 🕳️ Tagging and assessing severity
* 👁️ Maintaining a public, open record

---

## Why?

Why was there a need for this project? I got tired of seeing the condition of the roads in my city. Authorities work in silos and citizens are left to fend for themselves. This platform is a way to make this transparent and bring more visibility to the day to day problems the citizens face.

**What happens when the issue reported is fixed?**
Working towards a solution for this as well (eventually). The platform has just started and is still in its early stages. 
First priority is to get the platform working for the citizens and make it as easy as possible for them to report the issues.

---


## Current Implementation for Bengaluru

- [Bengaluru Potholes](https://blr-potholes.pages.dev)
- Your city next?

## 🛠️ Features

* ✅ Accept geo‑tagged images (most smartphones embed GPS data automatically).
* 👥 Moderation workflow to review and approve submissions.
* 🕳️ Categorization and severity tagging.
* 👁️ Transparent record of issues and status.
* 🌱 Modular and extensible design — adapt it for any city or use case.

## Transparency and Open Data

The project is not only transparent but also open. 
A little unconventional approach was taken to keep the data open by using Github Gists to store the data and not a regular database.

Open Tracking of Public Submissions is being done in regular Github Issues. This is a little unconventional approach as well but it works.
As building an open tracking system would have become a lot more complex and time consuming.
This way, the project is still open and transparent.

## Implementation for **Bengaluru**

The project is currently implemented for Bengaluru.
Website: [Bengaluru Potholes](https://blr-potholes.pages.dev)

Data store for Bengaluru:
[Bengaluru Potholes Data](https://gist.github.com/warlockdn/0b7ec8ca726075c58d8423ec17cf806a)

List of Moderators: (Not finalized yet)
[Bengaluru Potholes Moderators](https://gist.github.com/warlockdn/11d8071b86f230d327af1fd75fb235cd)

Submissions Tracking:
[Bengaluru Potholes Submissions](https://github.com/warlockdn/blr-potholes-data/issues)


### Install Dependencies
---

For UI:
```bash
cd ui
pnpm install
```

For API:
```bash
cd api
pnpm install
```

### Set Up Environment

- Copy `.env.example` to `.env` for `ui/` 
- For `api/`, copy `.dev.vars.example` to `.dev.vars`

### Run the Development Servers

In two terminals:

```bash
# Terminal 1: API (Cloudflare Worker)
cd api
pnpm dev
```

```bash
# Terminal 2: UI (Next.js Static Site)
cd ui
pnpm dev
```

- API runs on a local port (see output, usually 8787).
- UI runs on [http://localhost:3000](http://localhost:3000) and proxies API requests.

### Build for Production

```bash
# API
cd api
pnpm deploy

# UI
cd ../ui
pnpm build
```

---

## 🌱 Roadmap

* [ ] Enhance the moderation workflow
* [ ] Introduce more categories of issues
* [ ] Make the UX better (Need support here.)
* [ ] Expand to other civic infrastructure domains (streetlights, waste dumps, etc.)
* [ ] Add a way to track the status of the submissions (New, Approved, Rejected, Closed) in the webite itself.

---

## 👥 Contributing

Contributions are welcome!
Please open issues for ideas, questions, or bug reports.
Check the **CONTRIBUTING.md** (to be added soon) for guidelines.

---

## ⚖️ License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for more details.

---

## 💙 Acknowledgments

Open Urban Eyesore is a project inspired by the belief that **better data and open platforms can drive meaningful civic change**. Together, we can make our neighborhoods more accountable, inclusive, and resilient.

---
