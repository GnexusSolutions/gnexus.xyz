# Deploy `cymatics.gnexus.xyz`

The repository is a no-build static site.

## Local verification

Double-click `RUN_LOCAL.bat`, then open:

```text
http://127.0.0.1:3951/
```

## GitHub Pages

1. Review and merge the portfolio pull request.
2. Enable GitHub Pages from the `main` branch root.
3. In Pages settings, enter `cymatics.gnexus.xyz` as the custom domain.
4. At the DNS provider for `gnexus.xyz`, create the exact CNAME record GitHub Pages instructs you to use.
5. After DNS validation, enable HTTPS.

## Existing GNX hosting

If `gnexus.xyz` already uses another host or reverse proxy, point the `cymatics` subdomain to this repository's static output. The site has no server-side dependency.

## Public verification gate

Do not describe the site as live until the HTTPS route is opened and the following are verified:

- homepage loads from `https://cymatics.gnexus.xyz`;
- CSS, JavaScript, and SVG load successfully;
- scroll-world scenes update on desktop;
- mobile layout works at 390px width;
- résumé, LinkedIn copy, proof plan, and job-proof matrix are reachable;
- no private or legal-name-only material is exposed.

Repository presence is source proof, not deployment proof.
