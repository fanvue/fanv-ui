export function getStoryUrl(component: string, story: string): string {
  const toKebabCase = (str: string) =>
    str
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();

  const storyId = `components-${component.toLowerCase()}--${toKebabCase(story)}`;
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
