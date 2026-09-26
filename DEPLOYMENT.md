# Production deployment

The production URL is `https://flutterbystudioga.com/`. The site deploys from `main` through the **Validate and deploy GitHub Pages** workflow.

## 1. Verify the domain with GitHub

GitHub recommends domain verification before changing DNS. In the GitHub account for `grndlvl`:

1. Open **Settings → Pages**.
2. Add `flutterbystudioga.com` as a verified domain.
3. Add the TXT record GitHub provides to Namecheap under **Domain List → Manage → Advanced DNS → Host Records**.
4. Wait for the TXT record to resolve, then finish verification in GitHub. Keep the TXT record after verification.

## 2. Deploy the launch build

1. Push the launch changes to `main`.
2. Confirm the **Validate and deploy GitHub Pages** workflow succeeds.
3. Smoke-test the temporary GitHub Pages URL at `https://grndlvl.github.io/flutterby/`.

## 3. Configure the repository domain

1. Open `grndlvl/flutterby` on GitHub.
2. Go to **Settings → Pages**.
3. Confirm **Source** is **GitHub Actions**.
4. Enter `flutterbystudioga.com` under **Custom domain** and save it.

This repository uses a custom Actions workflow, so a `CNAME` file is not required and would be ignored by GitHub Pages.

## 4. Replace the Namecheap parking records

In Namecheap, open **Domain List → Manage → Advanced DNS → Host Records**.

Remove these current parking records and any other conflicting A, CNAME, ALIAS, or URL Redirect records for `@` or `www`:

- `A` record: `@` → `192.64.119.218`
- `CNAME` record: `www` → `parkingpage.namecheap.com`

Do not remove unrelated MX or TXT records used for email or domain verification.

Add these records with **TTL: Automatic**:

| Type         | Host  | Value                 |
| ------------ | ----- | --------------------- |
| A Record     | `@`   | `185.199.108.153`     |
| A Record     | `@`   | `185.199.109.153`     |
| A Record     | `@`   | `185.199.110.153`     |
| A Record     | `@`   | `185.199.111.153`     |
| AAAA Record  | `@`   | `2606:50c0:8000::153` |
| AAAA Record  | `@`   | `2606:50c0:8001::153` |
| AAAA Record  | `@`   | `2606:50c0:8002::153` |
| AAAA Record  | `@`   | `2606:50c0:8003::153` |
| CNAME Record | `www` | `grndlvl.github.io`   |

Save all changes. Do not include `https://` or `/flutterby` in the CNAME value.

## 5. Wait for DNS and HTTPS

DNS often updates within 30 minutes but can take up to 24 hours. Verify it with:

```bash
dig +short flutterbystudioga.com A
dig +short flutterbystudioga.com AAAA
dig +short www.flutterbystudioga.com CNAME
```

The apex should return the four `185.199.*.153` IPv4 addresses and four `2606:50c0:800*::153` IPv6 addresses. `www` should return `grndlvl.github.io`.

Back in **Repository Settings → Pages**, wait for the DNS check and TLS certificate to complete, then ensure **Enforce HTTPS** is selected. GitHub should redirect `www.flutterbystudioga.com` to the canonical apex domain.

## 6. Smoke-test production

1. Open `https://flutterbystudioga.com/` in a private browser window.
2. Check the page at desktop and mobile widths, navigation, images, social links, and HTTPS.
3. Submit one real contact-form test and confirm it appears in Formspark and reaches the configured notification inbox.
4. Check `https://flutterbystudioga.com/robots.txt` and `https://flutterbystudioga.com/sitemap.xml`.
