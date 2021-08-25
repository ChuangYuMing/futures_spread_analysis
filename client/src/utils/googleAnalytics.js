/* eslint-disable no-undef */

export function sendEvent({
  category,
  action,
  label,
  value,
  isNonInteraction
}) {
  window.gtag('event', action, {
    event_label: label,
    event_category: category,
    value,
    non_interaction: isNonInteraction
  })
}

export default { sendEvent }
