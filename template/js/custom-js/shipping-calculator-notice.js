// Custom notice rendered right below every shipping calculator on the storefront
// (product page, cart page, minicart and checkout), since all of them share the
// same `.shipping-calculator` component from @ecomplus/storefront-components.

const NOTICE_CLASS = 'shipping-calculator-notice'

const NOTICE_HTML = `
  <div class="${NOTICE_CLASS}" role="note">
    <strong>Atenção:</strong> O prazo de postagem pode alterar o prazo do tipo de frete escolhido.
    Os pacotes podem ser coletados em até 5 dias úteis, avaliem sua urgência.
    Produtos de promoção não têm reposição ou troca.
  </div>
`

const insertNotice = ($shippingCalculator) => {
  const $next = $shippingCalculator.nextElementSibling
  if ($next && $next.classList.contains(NOTICE_CLASS)) {
    return
  }
  $shippingCalculator.insertAdjacentHTML('afterend', NOTICE_HTML)
}

// Vue may destroy and recreate the calculator (minicart reopening, cart updates),
// leaving our notice behind as an orphan, so drop the ones no longer preceded by it.
const removeOrphanNotices = () => {
  document.querySelectorAll(`.${NOTICE_CLASS}`).forEach(($notice) => {
    const $previous = $notice.previousElementSibling
    if (!$previous || !$previous.classList.contains('shipping-calculator')) {
      $notice.remove()
    }
  })
}

const scanForShippingCalculators = () => {
  removeOrphanNotices()
  document.querySelectorAll('.shipping-calculator').forEach(insertNotice)
}

export const watchShippingCalculator = () => {
  scanForShippingCalculators()
  // the observer watches the whole body, so debounce to run once per frame at most
  let isScanScheduled = false
  const observer = new MutationObserver(() => {
    if (isScanScheduled) {
      return
    }
    isScanScheduled = true
    window.requestAnimationFrame(() => {
      isScanScheduled = false
      scanForShippingCalculators()
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', watchShippingCalculator)
} else {
  watchShippingCalculator()
}
