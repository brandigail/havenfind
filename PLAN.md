# HavenFind: Build Plan

- [x] 1. Scaffold the project (stack in `CLAUDE.md`), strict `tsconfig`, lint, `netlify.toml`, `.env.example`; first working commit
- [x] 2. Neon schema with PostGIS geometry and GIST index
- [x] 3. `types/` interfaces and zod schemas
- [x] 4. Seed script with 40+ listings and local placeholder images
- [x] 5. Listings API: bbox + filter query
- [x] 6. Client-only Leaflet map with clustering
- [x] 7. Listing cards and map/list sync
- [x] 8. Filter panel with URL state
- [x] 9. Listing detail page and gallery
- [x] 10. Mortgage calculator component with tests
- [x] 11. Saved homes (post-mount localStorage)
- [x] 12. Viewing booking form and API
- [ ] 13. Mobile layout (map/list toggle) and accessibility pass
- [ ] 14. Quality gate: `npm run build`, lint and `tsc --noEmit` all pass; no console errors; core flow tested at 375px and desktop
- [ ] 15. README: pitch, features, stack, architecture notes, screenshot placeholders, run steps, 3-bullet "what to demo to a recruiter", Phase 2 list
- [ ] 16. Deploy to Netlify, set env vars, verify the public URL end to end
- [ ] 17. Push to GitHub and update the live URL in `README.md` and the root `LINKS.md`
