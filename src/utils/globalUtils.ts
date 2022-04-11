export function changeIcon(btn: HTMLButtonElement, icon: string) {
  btn.removeChild(btn.firstChild);
  btn.innerHTML = icon;
  btn.removeChild(btn.firstChild);
}