# Publish the redesign

Production hosting uses Vercel. Configure the project to build `web/` and set
the public checkout, discount, launch-offer and feedback variables in Vercel.
These values are embedded at build time, so changing them requires a rebuild.
Builds read the committed release snapshot; run `npm run sync:releases` before
`npm run build` when the changelog needs refreshing. Do not sync during ordinary
tests. Committing source does not publish the website.

## Optional GitHub Pages workflow

The following release switches apply only to the existing GitHub Pages workflow,
not to Vercel. Its deploy gates remain unchanged.

The site describes the **next DeskUtils release** (macOS 15.2), not the DMG
currently listed in `site/appcast.xml`. CI builds a preview artifact by default;
production deployment is deliberately disabled until the matching app is ready.

Before enabling deployment:

1. Check the released DMG on supported Macs: macOS 15.2 minimum, supported CPU
   architectures, screenshot/annotation, clipboard 50 Free / 500 Pro, OCR,
   Scrolling Capture, Capture Subject and persistent display dimming gates.
2. Confirm the actual license behavior is lifetime access for up to two devices.
   Set `NEXT_PUBLIC_DESKUTILS_CHECKOUT_URL` to the Lemon Squeezy shareable
   checkout URL (the `/checkout/buy/` URL) and
   `NEXT_PUBLIC_DESKUTILS_DISCOUNT_CODE` to the active discount code. The site
   applies that code automatically when a customer selects Pro.
3. Verify signing/notarization on the artifact before adding any notarization claim.
4. Publish the matching app release and update `site/appcast.xml` using the existing
   signing scripts in the private app repository. Never hand-edit the signed feed.
5. Verify the `releases/latest/download/DeskUtils.dmg` URL serves that release.
6. Review the new Install, Privacy and Terms pages against the released behavior.
7. Set repository variable `DESKUTILS_WEBSITE_RELEASE_TAG` to that exact tag, then
   `DESKUTILS_WEBSITE_RELEASE_READY=true`. Run the Pages workflow on main.

The deploy job checks the feed's first item, minimum OS, latest release tag and DMG
availability before publishing. Feature support and supported CPUs require the
manual artifact checks above; a successful source build does not establish them.

## Changelog snapshot

`/changelog/` renders `web/content/releases.json`, a snapshot synced from the
public GitHub Releases API. CI runs `npm run sync:releases` before the build; a
failed sync fails the job and leaves the committed snapshot unchanged (it never
overwrites with empty data). The site build and tests read the snapshot and never
call GitHub from the browser. Publishing or editing a release in this repo
triggers the Pages workflow directly (`release: [published, edited]`); the app
repo can also rebuild cross-repo with a `repository_dispatch` of type
`release-published`. Run `npm run sync:releases` locally after cutting a release.

For rollback, disable `DESKUTILS_WEBSITE_RELEASE_READY`, revert the website source
change, and rebuild/redeploy the previous website artifact. Never restore an older
signed appcast as part of a visual rollback: keep the current feed and release
assets. Keep this switch off whenever website copy gets ahead of the public app.
