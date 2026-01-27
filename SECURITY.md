# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@fanvue.com

Include the following information:

- Type of issue (e.g., XSS, injection, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days (depending on severity)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅                 |
| < 1.0   | ❌ (pre-release)   |

## Security Measures

### Supply Chain Security

- Dependencies are audited via `pnpm audit` in CI
- Renovate automates security patches
- Lock files are committed for reproducibility

### Code Security

- No inline scripts or `dangerouslySetInnerHTML`
- No runtime style injection
- No network requests from library code
- Minimal dependency footprint

### CSP Compatibility

The library is designed to work with Content Security Policy headers. Components use Tailwind CSS classes compiled at build time.

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who report valid vulnerabilities.
