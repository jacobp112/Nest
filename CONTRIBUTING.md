# Contributing to Nest Finance

Nest Finance is a **private, closed‑source project** developed by a small internal team.  We are **not accepting external contributions or pull requests** from outside collaborators at this time.  The information below is provided for members of the Nest Finance team to coordinate development internally.

## Internal team guidelines

If you are part of the Nest Finance development team, please observe the following practices:

1. **Branching strategy**: Create feature branches from `main` using descriptive names (e.g. `feature/add-dashboard-chart`).  Keep each branch focused on a single change.
2. **Commit messages**: Write clear, descriptive commit messages explaining what was changed and why.  Use the imperative mood (e.g. “Add expense chart component”).
3. **Code style**: Follow our existing conventions (React functional components with hooks, TypeScript, and Tailwind CSS).  Use Prettier and ESLint (`npm run lint`) to ensure consistent formatting and catch linting issues before committing.
4. **Testing**: Add or update unit tests for any new functionality using React Testing Library.  Run the test suite locally (`npm test`) to ensure all tests pass before pushing changes.
5. **Documentation**: Update the README or add comments/docstrings where necessary to explain your changes and how to use any new functionality.
6. **Pull requests**: Open a PR once the feature is ready for review.  Assign reviewers and include a concise description of the change, any related issues, and notes for testing.  Resolve review comments promptly and keep the PR up‑to‑date with `main` by rebasing if necessary.
7. **Issue tracking**: Use GitHub Issues to document bugs and feature tasks.  Provide clear reproduction steps, expected vs. actual behaviour, environment details (browser, OS), and screenshots or logs when applicable.

## Code of Conduct

All contributors and team members are expected to uphold the [Code of Conduct](CODE_OF_CONDUCT.md).  Unacceptable behaviour should be reported to the maintainers privately.

## Thank you

Following these guidelines helps maintain a clean and efficient workflow and ensures that our internal collaboration runs smoothly.  Thank you for your efforts and dedication to Nest Finance.
