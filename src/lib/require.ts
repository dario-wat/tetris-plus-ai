export function check(condition: boolean): void {
  if (!condition) {
    throw Error('Require failed');
  }
}