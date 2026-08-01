# Deploy `cymatics.gnexus.xyz`

The source is a dependency-free static site.

## Local Windows runtime

Double-click `RUN_LOCAL.bat` or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\START_PORTFOLIO.ps1
```

The site opens at `http://127.0.0.1:3951/`.

## GitHub Pages

1. Merge the portfolio branch to `main`.
2. In repository settings, open **Pages**.
3. Set the source to **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Preserve the repository `CNAME` file containing `cymatics.gnexus.xyz`.
6. At the DNS provider for `gnexus.xyz`, create a CNAME record:
   - Name: `cymatics`
   - Target: `gnexussolutions.github.io`
7. Wait for DNS propagation and enable **Enforce HTTPS** in GitHub Pages.
8. Verify the homepage, all case-study routes, `resume.html`, JSON data, canonical URL, and HTTPS certificate.

No GitHub Actions workflow is required or included.
