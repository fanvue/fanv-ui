/**
 * Storybook parameters for stories whose value is not their pixels — an
 * interaction test, a controlled/uncontrolled wiring demo, or a prop permutation
 * that renders identically to a story already under baseline.
 *
 * `chromatic.disableSnapshot` keeps the story (and its `play` assertions) in
 * Storybook while taking it out of the snapshot count, so coverage that a
 * reviewer would never look at twice stops showing up on the bill.
 *
 * Mirrors `NON_VISUAL_STORY_PARAMETERS` in fanv-ui-internal so both repos use the
 * same vocabulary for this.
 */
export const NON_VISUAL_STORY_PARAMETERS = {
  chromatic: { disableSnapshot: true },
} as const;

/**
 * As {@link NON_VISUAL_STORY_PARAMETERS}, for a story that exists because the
 * Playwright suite in `e2e/` navigates to it directly. Those specs assert against a
 * single instance (`getByRole`, `getByTestId`), so they cannot target a cell inside
 * a matrix story — the individual story has to stay, but its appearance is already
 * covered by the matrix and does not need its own snapshot.
 *
 * Renaming or removing a story marked with this will fail the E2E job.
 */
export const E2E_FIXTURE_PARAMETERS = NON_VISUAL_STORY_PARAMETERS;
