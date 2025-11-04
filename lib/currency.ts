// Currency utility - always formats in EUR (€)

const CURRENCY_CODE = process.env.CURRENCY_CODE || 'EUR'

export function formatPrice(
  amount: number,
  options?: {
    showDecimals?: boolean
    showSymbol?: boolean
  }
): string {
  const { showDecimals = true, showSymbol = true } = options || {}

  const formatter = new Intl.NumberFormat('de-DE', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: CURRENCY_CODE,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  return formatter.format(amount)
}

export function parsePrice(priceString: string): number {
  // Remove currency symbols and parse
  const cleaned = priceString.replace(/[€,\s]/g, '')
  return parseFloat(cleaned) || 0
}
