# ADR 001: Restoration release architecture

## Status

Accepted

## Context

EdiReg is being restored as a public, portfolio-ready condominium operations
demo. The former local access list was removed and must not be restored. The
first release needs reliable authorization, reproducible fictional data, and a
deployment setup that demonstrates practical Docker experience without turning
the restoration into a platform rebuild.

## Decision

- Auth0 is the short-term source of identity and roles. It provides two
  fictional, manually provisioned demo accounts: Administrator and Concierge.
- The frontend uses a namespaced roles claim for navigation and route guards.
  The Express API verifies Auth0 JWTs and enforces API permissions; frontend
  visibility is never the authorization boundary.
- The public demo has no sign-up, local user JSON, or database-backed roles.
- Residences and resident contacts are fictional seeded reference data and are
  read-only in this release.
- Demo data is initialized with an idempotent fixture seed. A maintainer can
  reset it initially; an automated nightly reset follows after the hosted
  baseline is stable.
- Local development uses production-like Docker Compose for frontend, backend,
  and MongoDB, with image builds, health checks, and a named MongoDB volume.
- The public frontend deploys as a static Vercel application. The backend
  deploys from a Dockerfile to Render. MongoDB runs in MongoDB Atlas.
- The user interface supports English and Spanish. It initially follows a
  supported browser language, falls back to English, and persists an explicit
  language choice locally. `i18next` and `react-i18next` remain; Locize is
  removed for now.
- The first release covers concierge visit, package, and visitor-parking
  workflows plus administrator configuration of parking and timers. It is
  responsive and includes translated loading, empty, validation, success, and
  failure states.

## Consequences

The restoration work can focus on a small, secure operational demo. Real email
delivery, resident self-service, destructive administration, and
database-backed application roles are intentionally deferred. Hosted services
and environment configuration must be documented, while their secrets remain
outside the repository.
