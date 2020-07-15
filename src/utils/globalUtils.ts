export function changeIcon(btn: any, icon: any) {
  btn.removeChild(btn.firstChild);
  btn.innerHTML = icon;
  btn.removeChild(btn.firstChild);
}