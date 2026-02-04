export function getStoryUrl(component: string, story: string): string {
  const storyId = `components-${component.toLowerCase()}--${story.toLowerCase().replace(/\s+/g, "-")}`;
  return `/iframe.html?id=${storyId}`;
}

export function getStoryUrlWithArgs(
  component: string,
  story: string,
  args?: Record<string, string | number | boolean>,
): string {
  let url = getStoryUrl(component, story);

  if (args && Object.keys(args).length > 0) {
    const argParams = Object.entries(args)
      .map(([key, value]) => `${key}:${value}`)
      .join(";");
    url += `&args=${argParams}`;
  }

  return url;
}
