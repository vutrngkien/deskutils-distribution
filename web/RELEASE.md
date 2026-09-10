# Publish the redesign

The site describes the **next DeskUtils release** (macOS 15.2), not the DMG
currently listed in `site/appcast.xml`. CI builds a preview artifact by default;
production deployment is deliberately disabled until the matching app is ready.

Before enabling deployment:

1. Check the released DMG on supported Macs: macOS 15.2 minimum, supported CPU
   architectures, screenshot/annotation, clipboard 50 Free / 500 Pro, OCR,
   Scrolling Capture, Capture Subject and persistent display dimming gates.
2. Confirm the actual license behavior is annual access for one Mac. Keep website
   Pro sales **Coming soon**. This change does not configure Lemon Squeezy.
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

For rollback, disable `DESKUTILS_WEBSITE_RELEASE_READY`, revert the website source
change, and rebuild/redeploy the previous website artifact. Never restore an older
signed appcast as part of a visual rollback: keep the current feed and release
assets. Keep this switch off whenever website copy gets ahead of the public app.
